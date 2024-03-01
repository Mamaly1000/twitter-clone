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
    const notificationCount = await prisma.notification.count({
      where: {
        userId: currentUser.currentUser.id,
        isSeen: false,
      },
    });

    return res.status(200).json({
      ...currentUser.currentUser,
      notificationCount: notificationCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
