import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "request not allowed!" });
  }

  try {
    const currentUser = await serverAuth(req, res);

    if (!currentUser) {
      return res.status(401).json({ message: "Not Signed in" });
    }

    const { name, username, bio, profileImage, coverImage } = req.body;

    if (!!!name || !!!username) {
      return res
        .status(400)
        .json({ message: "name and username cannot be empty!" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
    });
    return res
      .status(200)
      .json({ updatedUser, message: "Updated successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to update user profile", error });
  }
}
