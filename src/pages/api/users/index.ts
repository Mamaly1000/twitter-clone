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
  const { search } = req.query;
  try {
    const currentUser = await serverAuth(req, res);
    let where = {};
    if (search && search !== "undefined") {
      where = {
        OR: [
          { username: { contains: search } },
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      };
    }
    if (currentUser) {
      where = {
        ...where,
        id: {
          not: currentUser.currentUser.id,
        },
      };
    }

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
      take: 30,
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "error in fetching users", error });
  }
}
