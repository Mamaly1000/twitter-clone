import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const user_id = req.query.user_id as string;
    if (!user_id) {
      return res.status(400).json({ message: "user_id is not valid" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    const followers = await prisma.user.count({
      where: {
        followingIds: {
          has: user_id,
        },
      },
    });
    if (!user) {
      return res.status(400).json({ message: "user doesnt exist" });
    }
    return res.status(200).json({ ...user, followersCount: followers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error occured in getting user_id data", error });
  }
}
