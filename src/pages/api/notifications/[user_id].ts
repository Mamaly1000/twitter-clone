import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== "string") {
      return res.status(404).json({ message: "invalid user id" });
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        notifications: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!userData) {
      return res.status(401).json({ message: "unAuthorized" });
    }
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userData.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            followingIds: true,
            name: true,
            createdAt: true,
          },
        },
        post: {
          include: {
            user: {
              select: {
                name: true,
                username: true,
                createdAt: true,
                id: true,
                email: true,
                followingIds: true,
              },
            },
            repost: {
              include: {
                user: {
                  select: {
                    name: true,
                    username: true,
                    createdAt: true,
                    id: true,
                    email: true,
                    followingIds: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        hasNotification: false,
      },
    });

    return res.status(200).json(notifications);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating notification", error });
  }
}
