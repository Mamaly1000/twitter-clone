import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import { includes } from "lodash";

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
      const { quote, userId, tweetContent, postId } = req.body;
      if (!userId || !tweetContent || !postId) {
        return res.status(404).json({ message: "Invalid user or tweet id!" });
      }

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

      const newRepost = await prisma.repost.create({
        data: {
          quoto: quote || null,
          userId,
          body: tweetContent,
          postId: selectedPost.id,
        },
      });
      const newPost = await prisma.post.create({
        data: {
          body: quote || "",
          userId: currentUser.currentUser.id,
          repostId: newRepost.id,
        },
      });
      let repostIds = [...selectedPost.repostIds, newRepost.id];
      await prisma.post.update({
        where: {
          id: selectedPost.id,
        },
        data: {
          repostIds: repostIds,
        },
      });

      try {
        if (currentUser.currentUser.id) {
          await prisma.notification.createMany({
            data: [
              ...currentUser.currentUser.followingIds.map((followedId) => ({
                actionUser: currentUser.currentUser.id,
                actionUsername: currentUser.currentUser.username || "",
                body: `in case you missed @${currentUser.currentUser.username} retweets.`,
                userId: followedId,
                postId: newPost.id,
                type: "REPOST",
              })),
              {
                body: `in case you missed @${currentUser.currentUser.username} retweets.`,
                userId: userId,
                postId: newPost.id,
                actionUser: currentUser.currentUser.id,
                type: "REPOST",
                actionUsername: currentUser.currentUser.username || "",
              },
            ],
          });
          await prisma.user.updateMany({
            where: {
              id: {
                in: includes(currentUser.currentUser.followingIds, userId)
                  ? currentUser.currentUser.followingIds
                  : [...currentUser.currentUser.followingIds, userId],
              },
            },
            data: {
              hasNotification: true,
            },
          });
        }
      } catch (error) {
        console.log("error in saving notification while liking", error);
      }

      return res.status(200).json({
        message: "repost created",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "error in getting reposts" });
  }
}
