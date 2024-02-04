import prisma from "@/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "req not allowed!",
    });
  }
  try {
    const userId = req.query.id as string;
    if (!userId || typeof userId !== "string") {
      return res.status(404).json({ message: "invalid id" });
    }
    const profile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!profile) {
      return res.status(404).json({ message: "user not found" });
    }
    const userFields = await prisma.field.findMany({
      where: {
        userId: profile.id,
      },
    });

    return res.status(200).json(userFields);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in getting users followers", error });
  }
}
