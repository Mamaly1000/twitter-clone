import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { includes, without } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }
  const user = await serverAuth(req, res);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const likedPostId = req.query.id as string;
    if (!likedPostId || typeof likedPostId !== "string") {
      return res.status(400).send("Invalid query params");
    }
    const post = await prisma.post.findUnique({ where: { id: likedPostId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    let likingIds = post.likedIds;
    const isLiked = includes(likingIds, user.currentUser.id);
    if (isLiked) {
      const newLikingIds = without(likingIds, user.currentUser.id);
      await prisma.post.update({
        where: { id: post.id },
        data: {
          likedIds: newLikingIds,
        },
      });
      try {
        await prisma.notification.create({
          data: {
            actionUsername: user.currentUser.username || "some body",
            body: `in case you missed @${user.currentUser.username} disLiked your reply`,
            type: "DISLIKE",
            userId: post.userId,
            actionUser: user.currentUser.id,
            postId: post.id,
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
      } catch (error) {
        console.log("failed to update the user notification");
      }
    } else {
      likingIds = [...likingIds, user.currentUser.id];
      await prisma.post.update({
        where: { id: post.id },
        data: {
          likedIds: likingIds,
        },
      });
      try {
        await prisma.notification.create({
          data: {
            actionUsername: user.currentUser.username || "some body",
            body: `in case you missed @${user.currentUser.username} Liked your reply`,
            type: "LIKE",
            userId: post.userId,
            actionUser: user.currentUser.id,
            postId: post.id,
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
      } catch (error) {
        console.log("failed to update the user notification");
      }
    }
    return res
      .status(200)
      .json({ message: isLiked ? "disliked" : "thanks for your like" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error happen in liking the comment" });
  }
}
