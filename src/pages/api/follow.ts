import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { without } from "lodash";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const userId = req.body.userId as string;
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

    let followingIds = currentUser.currentUser.followingIds;
    let followerIds = user.followerIds;

    if (req.method === "DELETE") {
      followingIds = without(followingIds, userId);
      followerIds = without(user.followerIds, currentUser.currentUser.id);
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

    if (req.method === "POST") {
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
        followingIds: followingIds,
      },
    });

    return res.status(200).json({
      message:
        req.method === "DELETE"
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
