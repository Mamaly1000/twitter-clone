import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { difference, without } from "lodash";
import HashtagHandler from "@/libs/HashtagHandler";
import { MediaType } from "@/components/forms/UploadedImagesForm";
import { PostsType } from "@/hooks/usePosts";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "request not allowed!" });
  }
  try {
    if (req.method === "GET") {
      const currentUser = await serverAuth(req, res);
      const {
        page,
        user_id,
        limit,
        search,
        postId,
      }: {
        search?: PostsType;
        page?: number;
        limit?: number;
        user_id?: string;
        postId?: string;
      } = req.query;

      const skip = (+(page || 1) - 1) * +(limit || 15);

      let where = {};

      if (user_id && typeof user_id === "string" && user_id !== "undefined") {
        where = {
          userId: user_id,
        };
      }

      if (currentUser && !user_id) {
        where = {
          OR: [
            {
              userId: {
                in: currentUser.currentUser.followerIds,
              },
            },
            {
              userId: {
                in: currentUser.currentUser.followingIds,
              },
            },
            {
              userId: currentUser.currentUser.id,
            },
          ],
        };
      }
      if (search && user_id) {
        const targetUser = await prisma.user.findUnique({
          where: {
            id: user_id,
          },
        });
        if (search === "liked") {
          where = {
            likedIds: {
              has: user_id,
            },
          };
        }
        if (search === "bookmark" && targetUser) {
          where = {
            bookmarkedIds: {
              has: targetUser.id,
            },
          };
        }
        if (search === "media" && targetUser) {
          where = {
            userId: targetUser.id,
            NOT: {
              mediaIds: {
                has: null,
              },
            },
          };
        }
        if (search === "replies" && targetUser) {
          where = {
            AND: [
              { userId: targetUser.id },
              { parentId: { not: null } }, // Filter for non-null parentId
            ],
          };
        }
        if (search === "comment" && postId) {
          where = {
            parentId: postId,
          };
        }
      }
      const totalPosts = await prisma.post.count({
        where,
      });
      const maxPages = Math.ceil(totalPosts / +(limit || 15));

      const posts = await prisma.post.findMany({
        where,
        take: +(limit || 15) + 1,
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
          medias: {
            select: {
              url: true,
            },
          },
        },
      });
      const isNextPage = posts.length > +(limit || 15); // Check if there are more items than the limit
      if (isNextPage) {
        posts.pop();
      }
      const hasPrev = +(page || 1) > 1;
      const hasNext = isNextPage;
      const pagination = {
        nextPage: hasNext ? +(page || 1) + 1 : null,
        prevPage: hasPrev ? +(page || 1) - 1 : null,
        currentPage: +(page || 1),
      };

      return res.status(200).json({
        posts,
        pagination: {
          ...pagination,
          hasPrev,
          hasNext,
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
      const { body, hashtags, mentions, medias } = req.body;
      const newPost = await prisma.post.create({
        data: { body: !!body ? body : "", userId: user.currentUser.id },
      });
      // handling tweet media media
      try {
        if (medias && medias?.length > 0) {
          const newMedias = await prisma.media
            .createMany({
              data: (medias as MediaType[]).map((m) => ({
                url: m.url,
                userId: user.currentUser.id,
                postIds: [newPost.id],
                description: m.desc,
              })),
            })
            .then(async () => {
              return await prisma.media.findMany({
                where: {
                  userId: user.currentUser.id,
                  postIds: {
                    has: newPost.id,
                  },
                },
                select: {
                  id: true,
                },
              });
            });

          await prisma.post.update({
            where: {
              id: newPost.id,
            },
            data: {
              mediaIds: newMedias.map((m) => m.id),
            },
          });
        }
      } catch (error) {
        console.log("error in creating media for the post");
      }
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
        let mentionedUsers: string[] = without(
          mentions || [],
          user.currentUser.id
        );
        let myFollowers = difference(
          user.currentUser.followerIds,
          mentionedUsers
        );

        await prisma.notification.createMany({
          data:
            mentionedUsers.length > 0
              ? [
                  ...myFollowers.map((id) => ({
                    userId: id,
                    actionUserId: user.currentUser.id,
                    isSeen: false,
                    body: `in case you missed it @${user.currentUser.username} tweets;`,
                    type: "TWEET",
                    postId: newPost.id,
                  })),
                  ...mentionedUsers.map((id) => ({
                    userId: id,
                    body: `in case you missed it @${user.currentUser.username} mentioned you in tweets;`,
                    postId: newPost.id,
                    type: "MENTION",
                    actionUserId: user.currentUser.id,
                    isSeen: false,
                  })),
                ]
              : myFollowers.map((id) => ({
                  userId: id,
                  actionUserId: user.currentUser.id,
                  isSeen: false,
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

      return res.status(200).json({ newPost, message: "your post was sent!" });
    }
  } catch (error) {
    console.log(error);

    return res
      .status(400)
      .json({ message: `error in posts ${req.method} method`, error });
  }
}
