import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }
  try {
    const userData = await serverAuth(req, res);
    if (!userData) {
      return res.status(401).json({ message: "unAuthorized" });
    }
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      throw new Error("invalid query");
    }
    const targetNotification = await prisma.notification.delete({
      where: {
        id,
      },
    });
    if (!targetNotification) {
      throw new Error("notification not exist!");
    }
    return res.status(200).json({
      message: "notification deleted!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in deleting notification", error });
  }
}
