import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .end()
      .json({ message: "only get request is available for this route" });
  }
  try {
    const currentUser = await serverAuth(req, res);
    if (!currentUser) {
      throw new Error("not authenticated");
    }
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUser.currentUser.id,
        },
        NOT: {
          followerIds: {
            has: currentUser.currentUser.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        bio: true,
        createdAt: true,
        email: true,
        id: true,
        followingIds: true,
        name: true,
        username: true,
        hasNotification: true,
        followerIds: true,
      },
      take: 5,
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "error in fetching users", error });
  }
}
