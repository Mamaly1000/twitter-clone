import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import HashtagHandler from "../../../libs/HashtagHandler";
import { includes } from "lodash";
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
    const { body, hashtags, mentions } = req.body;
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
        body,
        parentId: currentPost.id,
        userId: currentUser.currentUser.id,
        parentUsername: currentPost.user.username,
      },
    });
    const comment = await prisma.comment.create({
      data: {
        userId: currentUser.currentUser.id,
        postId: newPost.id,
        body,
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
          data: [
            ...mentionedUsers.map((id) => ({
              body: `in case you missed it @${currentUser.currentUser.username} mentioned you on its reply`,
              userId: post.userId,
              postId: post.id,
              actionUser: currentUser.currentUser.id,
              actionUsername: currentUser.currentUser.username || "some body",
              type: "MENTION",
            })),
            {
              body: mentionAndUserComment
                ? `in case you missed it @${currentUser.currentUser.username} replied and mentioned you on your tweet`
                : `in case you missed it @${currentUser.currentUser.username} replied on your tweet`,
              userId: post.userId,
              postId: post.id,
              actionUser: currentUser.currentUser.id,
              actionUsername: currentUser.currentUser.username || "some body",
              type: mentionAndUserComment ? "MENTION" : "COMMENT",
            },
          ],
        });
        await prisma.user.updateMany({
          where: {
            id: { in: [...mentionedUsers, post.userId] },
          },
          data: {
            hasNotification: true,
          },
        });
      }
    } catch (error) {
      console.log("error in saving notification while liking", error);
    }

    return res
      .status(200)
      .json({ message: "thanks for your comment!", comment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error happen for getting comments", error });
  }
}
