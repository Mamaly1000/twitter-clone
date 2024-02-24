import prisma from "@/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "req not allowed!",
    });
  }
  try {
    const { id: userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(404).json({ message: "invalid id" });
    }
    const profile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!profile) {
      return res.status(404).json({ message: "user not found" });
    }

    const bookmarkPosts = await prisma.post.findMany({
      where: {
        bookmarkedIds: {
          has: profile.id,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            createdAt: true,
            id: true,
            email: true,
            followerIds: true,
            followingIds: true,
          },
        },
        repost: {
          include: {
            user: {
              select: {
                username: true,
                name: true,
                createdAt: true,
                id: true,
                email: true,
                followerIds: true,
                followingIds: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(bookmarkPosts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in getting users followers", error });
  }
}
