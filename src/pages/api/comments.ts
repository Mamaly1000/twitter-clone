import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
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
    const { body } = req.body;
    const comment = await prisma.comment.create({
      data: {
        userId: currentUser.currentUser.id,
        postId: post_id as string,
        body,
      },
    });

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: post_id as string,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: `@${currentUser.currentUser.username} replied on your tweet`,
            userId: post.userId,
            postId: post.id,
            actionUser: currentUser.currentUser.id,
            actionUsername: currentUser.currentUser.username || "",
          },
        });
        await prisma.user.update({
          where: {
            id: post.userId,
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
