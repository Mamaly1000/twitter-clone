import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import HashtagHandler from "../../../libs/HashtagHandler";
import { includes } from "lodash";
import { MediaType } from "@/components/forms/UploadedImagesForm";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { post_id } = req.query;
    if (!post_id || typeof post_id !== "string") {
      res.status(404).json({ message: "Invalid query params" });
    }
    const currentUser = await serverAuth(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "not signed in!" });
    }
    const userLocation = await prisma.field.findFirst({
      where: {
        userId: currentUser.currentUser.id,
        type: "LOCATION",
      },
    });
    const { body, hashtags, mentions, medias } = req.body;
    const currentPost = await prisma.post.findUnique({
      where: {
        id: post_id as string,
      },
      include: {
        user: true,
      },
    });

    if (!currentPost) {
      return res.status(404).send("Not Found");
    }

    const newPost = await prisma.post.create({
      data: {
        body: !!body ? body : "",
        parentId: currentPost.id,
        userId: currentUser.currentUser.id,
        parentUsername: currentPost.user.username,
      },
    });
    const comment = await prisma.comment.create({
      data: {
        userId: currentUser.currentUser.id,
        postId: newPost.id,
        body: !!body ? body : "",
        parentId: post_id as string,
      },
    });

    const allCommentIds = [...currentPost.commentIds, comment.id];

    await prisma.post.update({
      where: {
        id: comment.parentId,
      },
      data: {
        commentIds: allCommentIds,
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
    // handle post notification
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: post_id as string,
        },
      });

      if (post?.userId) {
        let mentionedUsers: string[] = mentions || [];
        const mentionAndUserComment = includes(mentionedUsers, post.userId);
        await prisma.notification.createMany({
          data:
            post.userId !== currentUser.currentUser.id
              ? [
                  ...mentionedUsers.map((id) => ({
                    body: `in case you missed it @${currentUser.currentUser.username} mentioned you on its reply`,
                    userId: id,
                    postId: post.id,
                    actionUser: currentUser.currentUser.id,
                    actionUsername:
                      currentUser.currentUser.username || "some body",
                    type: "MENTION",
                  })),
                  {
                    body: mentionAndUserComment
                      ? `in case you missed it @${currentUser.currentUser.username} replied and mentioned you on your tweet`
                      : `in case you missed it @${currentUser.currentUser.username} replied on your tweet`,
                    userId: post.userId,
                    postId: post.id,
                    actionUser: currentUser.currentUser.id,
                    actionUsername:
                      currentUser.currentUser.username || "some body",
                    type: mentionAndUserComment ? "MENTION" : "COMMENT",
                  },
                ]
              : mentionedUsers.map((id) => ({
                  body: `in case you missed it @${currentUser.currentUser.username} mentioned you on its reply`,
                  userId: id,
                  postId: post.id,
                  actionUser: currentUser.currentUser.id,
                  actionUsername:
                    currentUser.currentUser.username || "some body",
                  type: "MENTION",
                })),
        });
        await prisma.user.updateMany({
          where: {
            id: {
              in:
                post.userId !== currentUser.currentUser.id
                  ? [...mentionedUsers, post.userId]
                  : mentionedUsers,
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

    return res.status(200).json({ message: "reply sent!", comment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error happen for getting comments", error });
  }
}
