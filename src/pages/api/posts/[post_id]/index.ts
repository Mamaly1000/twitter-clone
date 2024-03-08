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
    const postId = req.query.post_id as string;
    if (!postId || typeof postId !== "string") {
      return res
        .status(404)
        .json({ message: "Missing or invalid `post_id` parameter" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        repost: {
          include: {
            user: {
              select: {
                username: true,
                name: true,
                email: true,
                id: true,
              },
            },
            posts: {
              select: {
                createdAt: true,
              },
              where: {
                repostId: postId,
              },
            },
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const postsComments = await prisma.comment.findMany({
      where: {
        parentId: post.id,
      },
    });

    return res.status(200).json({ ...post, comments: postsComments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in getting single post data", error });
  }
}
