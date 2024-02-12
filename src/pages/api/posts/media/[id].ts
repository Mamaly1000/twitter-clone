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
    const postId = req.query.id as string;
    if (!postId || typeof postId !== "string") {
      return res
        .status(404)
        .json({ message: "Missing or invalid `post_id` parameter" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const postsMedias = await prisma.media.findMany({
      where: {
        postIds: {
          has: post.id,
        },
        userId: post.userId,
      },
    });

    return res.status(200).json(postsMedias);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in getting single post data", error });
  }
}
