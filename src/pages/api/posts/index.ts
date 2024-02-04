import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { difference, without } from "lodash";
import HashtagHandler from "@/libs/HashtagHandler";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "request not allowed!" });
  }
  try {
    if (req.method === "GET") {
      const userId = req.query.user_id as string;
      let limit = +(req.query.limit || 10) as number;
      const page = +(!!req.query.page ? req.query.page : 1) as number;

      const skip = (+page - 1) * +limit;

      if (userId || typeof userId === "string") {
        const totalPosts = await prisma.post.count({ where: { id: userId } });
        const maxPages = Math.ceil(totalPosts / limit);

        let usersPosts = await prisma.post.findMany({
          where: {
            userId,
          },
          skip: skip || 0,
          take: limit + 1,
          include: {
            user: {
              select: {
                name: true,
                username: true,
                createdAt: true,
                email: true,
                followingIds: true,
                hasNotification: true,
                id: true,
              },
            },
            repost: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const isNextPage = usersPosts.length > limit; // Check if there are more items than the limit
        if (isNextPage) {
          usersPosts.pop();
        }
        const hasPrev = page > 1;
        const hasNext = isNextPage;
        const nextPage = hasNext ? page + 1 : null;
        const prevPage = hasPrev ? page - 1 : null;
        const currentPage = page;

        res.status(200).json({
          posts: usersPosts,
          pagination: {
            hasPrev,
            hasNext,
            nextPage,
            prevPage,
            currentPage,
            maxPages,
            totalItems: totalPosts,
          },
        });
      }

      const totalPosts = await prisma.post.count({});
      const maxPages = Math.ceil(totalPosts / limit);

      let posts = await prisma.post.findMany({
        take: limit + 1,
        skip: skip || 0,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              username: true,
              createdAt: true,
              email: true,
              followingIds: true,
              hasNotification: true,
              id: true,
            },
          },
          repost: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  email: true,
                },
              },
              posts: {
                select: {
                  createdAt: true,
                },
              },
            },
          },
        },
      });
      const isNextPage = posts.length > limit; // Check if there are more items than the limit
      if (isNextPage) {
        posts.pop();
      }
      const hasPrev = page > 1;
      const hasNext = isNextPage;
      const nextPage = hasNext ? page + 1 : null;
      const prevPage = hasPrev ? page - 1 : null;
      const currentPage = page;

      res.status(200).json({
        posts,
        pagination: {
          hasPrev,
          hasNext,
          nextPage,
          prevPage,
          currentPage,
          maxPages,
          totalItems: totalPosts,
        },
      });
    }
    if (req.method === "POST") {
      const user = await serverAuth(req, res);
      if (!user) {
        return res.status(401).json({ message: "not singed in!" });
      }
      const userLocation = await prisma.field.findFirst({
        where: {
          userId: user.currentUser.id,
          type: "LOCATION",
        },
      });
      const { body, hashtags, mentions } = req.body;
      const newPost = await prisma.post.create({
        data: { body: body, userId: user.currentUser.id },
      });
      // handle hashtags
      try {
        if (hashtags && userLocation) {
          await HashtagHandler(
            user.currentUser.id,
            newPost.id,
            userLocation.value.toLowerCase(),
            hashtags || []
          );
        }
      } catch (error) {
        console.log("error in handling hashtags", error);
      }
      // handle notifications
      try {
        let mentionedUsers: string[] = mentions || [];
        let myFollowers = difference(
          user.currentUser.followerIds,
          mentionedUsers
        );

        await prisma.notification.createMany({
          data:
            mentionedUsers.length > 0
              ? [
                  ...myFollowers.map((id) => ({
                    actionUser: user.currentUser.id,
                    userId: id,
                    actionUsername: user.currentUser.username || "somebody",
                    body: `in case you missed it @${user.currentUser.username} tweets;`,
                    type: "TWEET",
                    postId: newPost.id,
                  })),
                  ...mentionedUsers.map((id) => ({
                    actionUser: user.currentUser.id,
                    userId: id,
                    actionUsername: user.currentUser.username || "some body",
                    body: `in case you missed it @${user.currentUser.username} mentioned you in tweets;`,
                    postId: newPost.id,
                    type: "MENTION",
                  })),
                ]
              : myFollowers.map((id) => ({
                  actionUser: user.currentUser.id,
                  userId: id,
                  actionUsername: user.currentUser.username || "some body",
                  body: `in case you missed it @${user.currentUser.username} tweets;`,
                  postId: newPost.id,
                  type: "TWEET",
                })),
        });
        await prisma.user.updateMany({
          where: {
            id: {
              in:
                mentionedUsers.length > 0
                  ? [...mentionedUsers, ...myFollowers]
                  : myFollowers,
            },
          },
          data: {
            hasNotification: true,
          },
        });
      } catch (error) {
        console.log("error in creating notification for created tweet");
      }

      return res.status(200).json({ newPost, message: "post created" });
    }
  } catch (error) {
    console.log(error);

    return res
      .status(400)
      .json({ message: `error in posts ${req.method} method`, error });
  }
}
