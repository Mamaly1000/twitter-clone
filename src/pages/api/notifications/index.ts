import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    const userData = await serverAuth(req, res);
    if (!userData) {
      return res.status(401).json({ message: "unAuthorized" });
    }
    const {
      page,
      limit,
    }: {
      page?: number;
      limit?: number;
    } = req.query;

    const skip = (+(page || 1) - 1) * +(limit || 15);
    const totalNotifs = await prisma.notification.count({
      where: {
        userId: userData.currentUser.id,
      },
    });
    const maxPages = Math.ceil(totalNotifs / +(limit || 15));

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userData.currentUser.id,
      },
      take: +(limit || 15) + 1,
      skip: skip || 0,
      orderBy: { createdAt: "desc" },
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
    });

    const isNextPage = notifications.length > +(limit || 15); // Check if there are more items than the limit
    if (isNextPage) {
      notifications.pop();
    }
    const hasPrev = +(page || 1) > 1;
    const hasNext = isNextPage;
    const pagination = {
      nextPage: hasNext ? +(page || 1) + 1 : null,
      prevPage: hasPrev ? +(page || 1) - 1 : null,
      currentPage: +(page || 1),
    };

    await prisma.user.update({
      where: {
        id: userData.currentUser.id,
      },
      data: {
        hasNotification: false,
      },
    });

    return res.status(200).json({
      notifications,
      pagination: {
        ...pagination,
        hasPrev,
        hasNext,
        maxPages,
        totalItems: totalNotifs,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating notification", error });
  }
}
