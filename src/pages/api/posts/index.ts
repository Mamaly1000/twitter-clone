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
            user: {
              select: {
                name: true,
                username: true,
                createdAt: true,
                email: true,
                followingIds: true,
                hasNotification: true,
                id: true,
              },
            },
            comments: {
              select: {
                body: true,
                createdAt: true,
                id: true,
                userId: true,
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            repost: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        posts = await prisma.post.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                username: true,
                createdAt: true,
                email: true,
                followingIds: true,
                hasNotification: true,
                id: true,
              },
            },
            comments: {
              select: {
                body: true,
                createdAt: true,
                id: true,
                userId: true,
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            repost: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
      }

      return res.status(200).json(posts);
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

      try {
        if (user.currentUser.id) {
          await prisma.notification.createMany({
            data: user.currentUser.followingIds.map((followedId) => ({
              actionUser: user.currentUser.id,
              actionUsername: user.currentUser.username || "",
              body: `@${user.currentUser.username} tweeted a new post.`,
              userId: followedId,
              postId: newPost.id,
            })),
          });
          await prisma.user.updateMany({
            where: {
              id: {
                in: user.currentUser.followingIds,
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

      return res.status(200).json({ newPost, message: "post created" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: `error in posts ${req.method} method`, error });
  }
}
