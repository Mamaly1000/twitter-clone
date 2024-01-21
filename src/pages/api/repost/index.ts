import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
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

      const newRepost = await prisma.repost.create({
        data: {
          quoto: quote || null,
          userId,
          body: tweetContent,
          postId,
        },
      });
      await prisma.post.create({
        data: {
          body: quote || "",
          userId: currentUser.currentUser.id,
          repostId: newRepost.id,
        },
      });
      await prisma.notification.create({
        data: {
          body: `@${currentUser.currentUser.username} reposted your tweet.`,
          userId: newRepost.userId,
          postId: newRepost.postId,
        },
      });
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hasNotification: true,
        },
      });
      return res.status(200).json({
        message: "repost created",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "error in getting reposts" });
  }
}
