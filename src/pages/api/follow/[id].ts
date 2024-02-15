import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { includes, without } from "lodash";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const userId = req.query.id as string;
    const currentUser = await serverAuth(req, res);

    if (!userId || typeof userId !== "string") {
      return res.status(500).json({ message: "Invalid id!" });
    }

    if (!currentUser) {
      return res.status(401).json({ message: "not singed in!" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const isFollowing = includes(currentUser.currentUser.followingIds, user.id);
    let followerIds: string[] = user.followerIds;
    let followingIds: string[] = currentUser.currentUser.followingIds;

    if (isFollowing) {
      followerIds = without(user.followerIds, currentUser.currentUser.id);
      followingIds = without(currentUser.currentUser.followingIds, user.id);
    } else {
      followerIds = [...user.followerIds, currentUser.currentUser.id];
      followingIds = [...currentUser.currentUser.followingIds, user.id];
    } 

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        followerIds,
      },
    });
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.currentUser.id,
      },
      data: {
        followingIds,
      },
    });
    if (isFollowing) {
      try {
        if (userId) {
          await prisma.notification.create({
            data: {
              actionUser: currentUser.currentUser.id,
              userId: userId,
              actionUsername: currentUser.currentUser.username || "somebody",
              body: `in case you missed; @${currentUser.currentUser.username} unfollows you.`,
              type: "UNFOLLOW",
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
        }
      } catch (error) {
        console.log("error in saving notification while liking", error);
      }
    }

    if (!isFollowing) {
      followingIds.push(userId);
      followerIds.push(currentUser.currentUser.id);
      try {
        if (userId) {
          await prisma.notification.create({
            data: {
              actionUser: currentUser.currentUser.id,
              userId: userId,
              actionUsername: currentUser.currentUser.username || "somebody",
              body: `in case you missed; @${currentUser.currentUser.username} follows you.`,
              type: "FOLLOW",
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
        }
      } catch (error) {
        console.log("error in saving notification while liking", error);
      }
    }

    return res.status(200).json({
      message: isFollowing
        ? `unfollow ${user.username}`
        : `following ${user.username}`,
      updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: `error happened for follow ${req.method} method!`,
      error,
    });
  }
}
