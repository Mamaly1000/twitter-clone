import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const currentUser = await serverAuth(req, res);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }
    const user_id = req.query.user_id as string;
    if (!user_id) {
      return res.status(400).json({ message: "user_id is not valid" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        reposts: true,
        posts: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(400).json({ message: "user doesnt exist" });
    }
    const profileFields = await prisma.field.findMany({
      where: {
        userId: user.id,
      },
    });
    // check which currentuser followers followed this user  and add it to the data
    // users who i follow them
    const targetUserFollowerIds = user.followerIds;

    // lets find my followings which are this user followers
    const mutualFollowers = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              in: targetUserFollowerIds,
            },
          },
          {
            followerIds: {
              has: currentUser.currentUser.id,
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
      },
      take: 3,
    });
    const mutualFollowersCount = await prisma.user.count({
      where: {
        AND: [
          {
            id: {
              in: targetUserFollowerIds,
            },
          },
          {
            followerIds: {
              has: currentUser.currentUser.id,
            },
          },
        ],
      },
      select: {
        bio: true,
        createdAt: true,
        id: true,
        followingIds: true,
        followerIds: true,
        name: true,
        username: true,
      },
      skip: 3,
    });

    return res.status(200).json({
      ...user,
      profileFields: profileFields || [],
      mutualFollowers,
      mutualFollowersCount: mutualFollowersCount || 0,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error occured in getting user_id data", error });
  }
}
