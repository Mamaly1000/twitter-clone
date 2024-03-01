import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { includes } from "lodash";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: `Method ${req.method}` });
  }
  try {
    const { postId } = req.body;
    const currentUser = await serverAuth(req, res);

    if (!postId || typeof postId !== "string") {
      return res
        .status(400)
        .json({ message: "Missing or invalid parameter 'id'" });
    }

    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "You must be logged in to perform this action." });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = includes(post.likedIds, currentUser.currentUser.id);

    let likedIds = [...(post.likedIds || [])];

    if (!isLiked) {
      likedIds.push(currentUser.currentUser.id);
      //  handle liking notification
      if (post.userId !== currentUser.currentUser.id) {
        try {
          const post = await prisma.post.findUnique({
            where: {
              id: postId,
            },
          });

          if (post?.userId) {
            await prisma.notification.create({
              data: {
                body: `in case you missed it @${currentUser.currentUser.username} liked your tweet`,
                postId: post.id,
                userId: post.userId,
                type: "LIKE",
                actionUserId: currentUser.currentUser.id,
                isSeen: false,
              },
            });
            await prisma.user.update({
              where: {
                id: post.userId,
              },
              data: {
                hasNotification: true,
              },
            });
          }
        } catch (error) {
          console.log("error in saving notification while liking", error);
        }
      }
    } else {
      likedIds = likedIds.filter((id) => id !== currentUser.currentUser.id);
      //  handle disliking notification
      if (post.userId !== currentUser.currentUser.id) {
        try {
          const post = await prisma.post.findUnique({
            where: {
              id: postId,
            },
          });
          try {
            if (post?.userId) {
              await prisma.notification.create({
                data: {
                  body: `in case you missed it @${currentUser.currentUser.username} disLiked your tweet`,
                  userId: post.userId,
                  actionUserId: currentUser.currentUser.id,
                  type: "DISLIKE",
                  postId: post.id,
                  isSeen: false,
                },
              });
              await prisma.user.update({
                where: {
                  id: post.userId,
                },
                data: {
                  hasNotification: true,
                },
              });
            }
          } catch (error) {
            console.log("error in creating notif while dislike tweet");
          }
        } catch (error) {
          console.log("error in saving notification while disLiking", error);
        }
      }
    }
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: likedIds,
      },
    });

    return res.status(200).json({
      message: isLiked ? "liked" : "disliked",
      updatedPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error for like ${req.method} method`, error });
  }
}
