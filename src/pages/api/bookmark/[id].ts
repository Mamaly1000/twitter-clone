import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { includes, without } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const currentUser = await serverAuth(req, res);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }
    const postId = req.query.id as string;
    if (!postId || typeof postId !== "string") {
      return res.status(400).send(`Bad request`);
    }
    const TargetPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!TargetPost) {
      return res.status(404).send("tweet Not Found");
    }

    const isBookmarked = includes(
      TargetPost.bookmarkedIds,
      currentUser.currentUser.id
    );

    if (isBookmarked) {
      let newBookmarkList = without(
        TargetPost.bookmarkedIds,
        currentUser.currentUser.id
      );
      await prisma.post.update({
        where: { id: TargetPost.id },
        data: {
          bookmarkedIds: newBookmarkList,
        },
      });
    }
    if (!isBookmarked) {
      let newBookmarkList = [
        ...TargetPost.bookmarkedIds,
        currentUser.currentUser.id,
      ];
      await prisma.post.update({
        where: { id: TargetPost.id },
        data: {
          bookmarkedIds: newBookmarkList,
        },
      });
    }
    // handle bookmark notification
    if (TargetPost.userId !== currentUser.currentUser.id) {
      try {
        await prisma.notification.create({
          data: {
            body: !isBookmarked
              ? `in case you missed @${currentUser.currentUser.username} bookmarked your tweet;`
              : `in case you missed @${currentUser.currentUser.username} unbookmarked your tweet;`,
            type: !isBookmarked ? "BOOKMARK" : "UNBOOKMARK",
            userId: TargetPost.userId,
            postId: TargetPost.id,
            actionUserId: currentUser.currentUser.id,
            isSeen: false,
          },
        });
        await prisma.user.update({
          where: {
            id: TargetPost.userId,
          },
          data: {
            hasNotification: true,
          },
        });
      } catch (error) {
        console.log("error in bookmark notification", error);
      }
    }

    return res.status(200).json({
      message: isBookmarked ? "unBookmarked" : "Bookmarked",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in bookmarking a post", error });
  }
}
