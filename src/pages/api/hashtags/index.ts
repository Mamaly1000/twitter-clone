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
    const { search } = req.query;

    let where = {};
    if (search && search !== "undefined") {
      where = {
        OR: [
          { name: { contains: search } },
          { location: { contains: search } },
        ],
      };
    }

    const currentUser = await serverAuth(req, res);

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userLocation = await prisma.field.findFirst({
      where: {
        userId: currentUser.currentUser.id,
        type: "LOCATION",
      },
    });

    const hashtags = await prisma.hashtag.findMany({
      where,
      orderBy: {
        count: "desc",
      },
    });
    if (!userLocation) {
      return res.status(200).json({ data: hashtags });
    }
    const currentUserHashtags = await prisma.hashtag.findMany({
      where: {
        location: userLocation.value,
      },
      take: 5,
      orderBy: {
        count: "desc",
      },
    });

    return res
      .status(200)
      .json({ hashtags, currentUserHashtags: currentUserHashtags || [] });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating notification", error });
  }
}
