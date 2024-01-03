import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .end()
      .json({ message: "only get request is available for this route" });
  }
  try {
    const username = req.query.username as string;
    if (username) {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) throw new Error("User not found");
      return res.status(200).json(user);
    }
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "error in fetching users", error });
  }
}
