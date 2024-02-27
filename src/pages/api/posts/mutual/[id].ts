import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { set } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "request not allowed!" });
  }
  try {
    const user = await serverAuth(req, res);
    if (!user) {
      return res.status(405).end().json({
        message: "unAuthenticated",
      });
    }
    const postId = req.query.id as string;
    if (!postId || typeof postId !== "string") {
      return res.status(405).end().json({ message: "invalid id" });
    }
    const mutualReplies = await prisma.post
      .findMany({
        where: {
          AND: [
            {
              userId: {
                not: user.currentUser.id,
              },
            },
            {
              userId: {
                in: user.currentUser.followingIds,
              },
              parentId: postId,
            },
          ],
        },
        include: {
          user: {
            select: {
              name: true,
              username: true,
              createdAt: true,
              email: true,
              followingIds: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .then((res) => {
        const uniqueIDs: Set<string> = new Set([]);
        return res
          .map((r) => {
            if (!uniqueIDs.has(r.userId)) {
              uniqueIDs.add(r.userId);
              return r;
            }
          })
          .filter((r) => !!r);
      });

    return res.status(200).json(mutualReplies || []);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error happen in getting mutual replies",
    });
  }
}
