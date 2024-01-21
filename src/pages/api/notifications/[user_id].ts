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

    const notifs = await prisma.notification.findMany({
      where: {
        userId: user_id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      include: {
        user: true,
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

    return res.status(200).json(notifs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating notification", error });
  }
}
