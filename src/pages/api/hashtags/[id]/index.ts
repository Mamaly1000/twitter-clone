import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { uniq } from "lodash";

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

    const hashtagsPosts = await prisma.post.findMany({
      where: {
        id: { in: targetHashtag.postIds },
      },
    });
    const updatedHashtag = await prisma.hashtag.update({
      where: {
        id: targetHashtag.id,
      },
      data: {
        postIds: hashtagsPosts.map((p) => p.id),
        userIds: uniq(hashtagsPosts.map((p) => p.userId)),
        count: hashtagsPosts.length,
      },
    });

    if (!updatedHashtag) {
      throw new Error(`Failed to update Hashtag ${hashtagId}`);
    }

    return res.status(200).json({
      hashtags: updatedHashtag,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating notification", error });
  }
}
