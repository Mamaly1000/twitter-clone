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
    const limit = 15;
    const { page, hashtagId, search }: Partial<any> = req.query;
    const skip = (+(page || 1) - 1) * limit;
    let where = {};

    if (search) {
      where = {
        OR: [
          { name: { contains: search } },
          { location: { contains: search } },
        ],
      };
    }

    if (hashtagId) {
      const targetHashtag = await prisma.hashtag.findUnique({
        where: {
          id: hashtagId,
        },
      });
      if (targetHashtag) {
        where = {
          id: targetHashtag.id,
        };
      }
    }

    const hashtags = await prisma.hashtag.findMany({
      where,
      take: limit + 1,
      skip: skip || 0,
      orderBy: {
        count: "desc",
      },
    });
    const totalHashtags = await prisma.hashtag.count({
      where,
    });
    const maxPages = Math.ceil(totalHashtags / limit);

    const isNextPage = hashtags.length > limit; // Check if there are more items than the limit
    if (isNextPage) {
      hashtags.pop();
    }
    const hasPrev = +(page || 1) > 1;
    const hasNext = isNextPage;
    const pagination = {
      nextPage: hasNext ? +(page || 1) + 1 : null,
      prevPage: hasPrev ? +(page || 1) - 1 : null,
      currentPage: +(page || 1),
    };

    return res.status(200).json({
      hashtags,
      pagination: {
        ...pagination,
        hasPrev,
        hasNext,
        maxPages,
        totalItems: totalHashtags,
      },
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "error in getting hashtags", error });
  }
}
