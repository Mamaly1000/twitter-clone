import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { UsersTypes } from "@/hooks/useUsers";
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
    const limit = 5;
    const {
      userId,
      page,
      search,
      type,
      hashtagId,
    }: {
      userId?: string;
      page?: string;
      search?: string;
      type?: UsersTypes;
      hashtagId?: string;
    } = req.query;

    const skip = (+(page || 1) - 1) * +(limit || 15);
    const currentUser = await serverAuth(req, res);
    let where = {};
    if (hashtagId && type === "hashtag") {
      const targetHashtag = await prisma.hashtag.findUnique({
        where: {
          id: hashtagId,
        },
      });
      if (!targetHashtag) {
        return res.status(404).json({ message: "hashtag not found!" });
      }
      where = {
        id: {
          in: targetHashtag.userIds,
        },
      };
    }
    if (userId && type !== "all") {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!targetUser) {
        return res.status(404).json({ message: "user not found!" });
      }
      if (type === "single-user") {
        return res.status(200).json(targetUser);
      }
      if (type === "followers") {
        where = {
          id: {
            in: targetUser.followerIds,
          },
        };
      }
      if (type === "followings") {
        where = {
          id: {
            in: targetUser.followingIds,
          },
        };
      }
    }
    if (currentUser && type !== "single-user") {
      if (type === "recommended") {
        where = {
          id: {
            not: currentUser.currentUser.id,
          },
          NOT: {
            followerIds: {
              has: currentUser.currentUser.id,
            },
          },
        };
      } else {
        where = {
          ...where,
          id: {
            not: currentUser.currentUser.id,
          },
        };
      }
    }
    if (search && type === "all") {
      where = {
        ...where,
        OR: [
          { username: { startsWith: search } },
          { name: { startsWith: search } },
          { email: { startsWith: search } },
          { username: { contains: search } },
          { name: { contains: search } },
          { email: { contains: search } },
          { username: { endsWith: search } },
          { name: { endsWith: search } },
          { email: { endsWith: search } },
        ],
      };
    }
    const totalUsers = await prisma.user.count({
      where,
    });
    const maxPages = Math.ceil(totalUsers / +(limit || 15));

    const users = await prisma.user.findMany({
      where,
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
      },
      take: type === "recommended" ? 5 : +(limit || 15) + 1,
      skip: skip || 0,
    });
    const isNextPage = users.length > +(limit || 15); // Check if there are more items than the limit
    if (isNextPage) {
      users.pop();
    }
    const hasPrev = +(page || 1) > 1;
    const hasNext = isNextPage;
    const pagination = {
      nextPage: hasNext ? +(page || 1) + 1 : null,
      prevPage: hasPrev ? +(page || 1) - 1 : null,
      currentPage: +(page || 1),
    };

    return res.status(200).json({
      users,
      pagination: {
        ...pagination,
        hasPrev,
        hasNext,
        maxPages,
        totalItems: totalUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "error in fetching users", error });
  }
}
