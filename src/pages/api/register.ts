import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { email, username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
        username,
      },
    });
    return res
      .status(200)
      .json({
        user,
        message: user?.name ? `wellcome ${user.name}` : "wellcome to twitter",
      });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
