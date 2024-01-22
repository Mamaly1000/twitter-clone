import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "request not allowed!" });
  }
  try {
    if (req.method === "GET") {
      const userId = req.query.user_id as string;
      let posts;
      if (userId || typeof userId === "string") {
        posts = await prisma.post.findMany({
          where: {
            userId,
          },
          include: {
            user: true,
            comments: true,
            repost: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        posts = await prisma.post.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                bio: true,
                createdAt: true,
                email: true,
                followingIds: true,
                coverImage: false,
                emailVerified: true,
                hashedPassword: false,
                hasNotification: true,
                image: false,
                id: true,
                notifications: false,
                posts: false,
                profileImage: false,
                reposts: false,
                updatedAt: true,
                username: true,
              },
            },
            comments: {
              select: {
                id: true,
                userId: true,
              },
            },
            repost: {
              include: {
                user: true,
              },
            },
          },
        });
      }

      return res.status(200).json(posts.slice(0, 20));
    }
    if (req.method === "POST") {
      const user = await serverAuth(req, res);
      if (!user) {
        return res.status(401).json({ message: "not singed in!" });
      }
      const { body } = req.body;
      const newPost = await prisma.post.create({
        data: { body: body, userId: user.currentUser.id },
      });

      return res.status(200).json({ newPost, message: "post created" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: `error in posts ${req.method} method`, error });
  }
}
