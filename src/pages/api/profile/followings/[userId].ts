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
    const { userId } = req.query;
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
    const followings = await prisma.user.findMany({
      where: {
        id: {
          in: profile.followingIds,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        followerIds: true,
        followingIds: true,
        name: true,
        bio: true,
      },
    });

    return res.status(200).json(followings);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in getting users followings", error });
  }
}
