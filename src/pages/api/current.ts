import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const currentUser = await serverAuth(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "not signed in!" });
    }
    // if someone is reading this code i should confess that it is not an optimize way to track your mutaulfollowings comments
    const mutualReplies = await prisma.comment.findMany({
      where: {
        userId: {
          in: currentUser.currentUser.followingIds,
        },
      }, 
      select: {
        id: true,
        createdAt: true,
        postId: true,
        body: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json({
      ...currentUser.currentUser,
      mutualReplies: mutualReplies || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
