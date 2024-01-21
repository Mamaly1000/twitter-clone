import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "req not allowed!" });
  }
  try {
    const { repostId } = req.query;
    await serverAuth(req, res);
    if (!repostId || typeof repostId !== "string") {
      return res.status(404).json({ message: "Invalid Id!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error in ${req.method} method`, error });
  }
}
