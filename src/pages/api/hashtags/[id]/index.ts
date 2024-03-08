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

    const hashtagId = req.query.id as string;
    if (!hashtagId || typeof hashtagId !== "string") {
      throw new Error("Invalid query parameter");
    }

    const targetHashtag = await prisma.hashtag.findUnique({
      where: { id: hashtagId },
    });

    if (!targetHashtag) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      hashtags: targetHashtag,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating notification", error });
  }
}
