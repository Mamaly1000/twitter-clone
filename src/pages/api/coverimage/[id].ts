import prisma from "@/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    const userId = req.query.id as string;
    if (!userId || typeof userId !== "string") {
      res.status(404).json({ message: "Invalid query params" });
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!currentUser) {
      return res.status(401).json({ message: "not signed in!" });
    }

    const coverImage = await prisma.coverImage.findUnique({
      where: {
        userId: currentUser.id,
      },
      include: {
        user: {
          select: {
            username: true,
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json(coverImage);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error happen for getting coverImage", error });
  }
}
