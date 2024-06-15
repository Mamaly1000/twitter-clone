import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import { difference, includes, without } from "lodash";
import HashtagHandler from "@/libs/HashtagHandler";
import { MediaType } from "@/components/forms/UploadedImagesForm";
import { Media } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "request is not allowed!" });
  }
  try {
    const currentUser = await serverAuth(req, res);

    if (!currentUser) {
      return res.status(401).json({ message: "unAuthenticated!" });
    }

    if (req.method === "GET") {
      const reposts = await prisma.repost.findMany({
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(reposts);
    }
    if (req.method === "POST") {
      const {
        quote,
        postId,
        hashtags,
        mentions,
        medias,
      }: {
        quote?: string;
        postId?: string;
        hashtags?: string[];
        mentions?: string[];
        medias?: MediaType[];
      } = req.body;
      // validations for body data
      if (!postId) {
        return res.status(404).json({ message: "Invalid user or tweet id!" });
      }
      if (quote && quote.trim().length === 0) {
        return res.status(400).json({ message: "Invalid quote!" });
      }
      if (!quote && !(medias || medias!.length > 0)) {
        return res.status(400).json({ message: "Invalid media or quoto!" });
      }
      // find the user location
      const userLocation = await prisma.field.findFirst({
        where: {
          userId: currentUser.currentUser.id,
          type: "LOCATION",
        },
      });
      // find the target post
      const selectedPost = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!selectedPost) {
        return res.status(404).json({
          message: "The Post you are trying to Repost does not exist.",
        });
      }
      // create a new repost with target post id and userId
      const newRepost = await prisma.repost.create({
        data: {
          quoto: quote || null,
          userId: selectedPost.userId,
          body: selectedPost.body,
          postId: selectedPost.id,
        },
      });
      // create the new post by current user
      const newPost = await prisma.post.create({
        data: {
          body: quote || "",
          userId: currentUser.currentUser.id,
          repostId: newRepost.id,
        },
      });
      // update repostids array in the target post
      let repostIds = [...selectedPost.repostIds, newRepost.id];
      await prisma.post.update({
        where: {
          id: selectedPost.id,
        },
        data: {
          repostIds: repostIds,
        },
      });
      // handling tweet media media
      try {
        if (medias && medias?.length > 0) {
          const newMedias = await prisma.media
            .createMany({
              data: (medias as MediaType[]).map((m) => ({
                url: m.url,
                userId: currentUser.currentUser.id,
                postIds: [newPost.id],
                description: m.desc,
              })),
            })
            .then(async () => {
              return await prisma.media.findMany({
                where: {
                  userId: currentUser.currentUser.id,
                  postIds: {
                    has: newPost.id,
                  },
                },
                select: {
                  id: true,
                },
              });
            });

          await prisma.post.update({
            where: {
              id: newPost.id,
            },
            data: {
              mediaIds: newMedias.map((m) => m.id),
            },
          });
        }
      } catch (error) {
        console.log("error in creating media for the post");
      }
      // handle hashtags
      try {
        if (hashtags && userLocation) {
          await HashtagHandler(
            currentUser.currentUser.id,
            newPost.id,
            userLocation.value.toLowerCase(),
            hashtags || []
          );
        }
      } catch (error) {
        console.log("error in handling hashtags", error);
      }
      // repost notifications
      try {
        let mentionedUsers: string[] = without(
          mentions || [],
          currentUser.currentUser.id
        );
        let myFollowers = difference(
          currentUser.currentUser.followerIds,
          mentionedUsers
        );
        if (currentUser.currentUser.id) {
          await prisma.notification.createMany({
            data:
              mentionedUsers.length > 0
                ? [
                    ...myFollowers.map((followedId) => ({
                      actionUserId: currentUser.currentUser.id,
                      isSeen: false,
                      body: `in case you missed @${currentUser.currentUser.username} retweets.`,
                      userId: followedId,
                      postId: newPost.id,
                      type: "REPOST",
                    })),
                    ...mentionedUsers.map((id) => ({
                      body: `in case you missed @${currentUser.currentUser.username} mentioned you in a retweets.`,
                      userId: id,
                      postId: newPost.id,
                      type: "MENTION",
                      actionUserId: currentUser.currentUser.id,
                      isSeen: false,
                    })),
                    {
                      body: `in case you missed @${currentUser.currentUser.username} retweets your tweet.`,
                      userId: selectedPost.userId,
                      postId: newPost.id,
                      actionUserId: currentUser.currentUser.id,
                      isSeen: false,
                      type: "REPOST",
                    },
                  ]
                : [
                    ...myFollowers.map((followedId) => ({
                      actionUserId: currentUser.currentUser.id,
                      isSeen: false,
                      body: `in case you missed @${currentUser.currentUser.username} retweets.`,
                      userId: followedId,
                      postId: newPost.id,
                      type: "REPOST",
                    })),
                    {
                      body: `in case you missed @${currentUser.currentUser.username} retweets your tweet.`,
                      userId: selectedPost.userId,
                      postId: newPost.id,
                      actionUserId: currentUser.currentUser.id,
                      isSeen: false,
                      type: "REPOST",
                    },
                  ],
          });
          let mentionIds = includes(mentionedUsers, selectedPost.userId)
            ? without(mentionedUsers, selectedPost.userId)
            : mentionedUsers;
          let followersIds = includes(
            currentUser.currentUser.followerIds,
            selectedPost.userId
          )
            ? currentUser.currentUser.followerIds
            : [...currentUser.currentUser.followerIds, selectedPost.userId];
          let notifIds = [mentionIds, followersIds].flat();
          await prisma.user.updateMany({
            where: {
              id: {
                in: notifIds,
              },
            },
            data: {
              hasNotification: true,
            },
          });
        }
      } catch (error) {
        console.log("error in saving notification while reposting", error);
      }

      return res.status(200).json({
        message: "repost created",
        repostId: newPost.id,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "error in getting reposts" });
  }
}
