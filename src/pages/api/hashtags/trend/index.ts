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
    const currentUser = await serverAuth(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userLocation = await prisma.field.findFirst({
      where: {
        type: "LOCATION",
        userId: currentUser.currentUser.id,
      },
    });
    let where = {};
    if (userLocation) {
      where = {
        location: userLocation.value.toLowerCase() || null,
      };
    }

    const hashtags = await prisma.hashtag.findMany({
      where,
      orderBy: {
        count: "desc",
      },
      take: 5,
    });
    return res.status(200).json(hashtags);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating notification", error });
  }
}
