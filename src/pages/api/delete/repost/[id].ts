import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).end().json({ message: "invalid request method" });
  }
  try {
    const currentUser = await serverAuth(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "unAuthorized!" });
    }
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(404).json({ message: "Invalid Id!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error in deleting repost", error });
  }
}
