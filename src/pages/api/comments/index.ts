import prisma from "@/libs/prisma";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import HashtagHandler from "../../../libs/HashtagHandler";
import { includes, without } from "lodash";
import { MediaType } from "@/components/forms/UploadedImagesForm";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    if (req.method === "GET") {
      const limit = 5;
      const {
        postId,
        page,
      }: {
        page?: string;
        postId?: string;
      } = req.query;
      const skip = (+(page || 1) - 1) * limit;
      let where = {};

      if (postId) {
        where = {
          parentId: postId,
        };
      }

      const comments = await prisma.comment.findMany({
        where,
        skip,
        take: limit + 1,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              id: true,
              username: true,
            },
          },
          post: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalComments = await prisma.comment.count({
        where,
      });
      const maxPages = Math.ceil(totalComments / limit);
      const isNextPage = comments.length > limit;
      if (isNextPage) {
        comments.pop();
      }
      const hasPrev = +(page || 1) > 1;
      const hasNext = isNextPage;
      const pagination = {
        nextPage: hasNext ? +(page || 1) + 1 : null,
        prevPage: hasPrev ? +(page || 1) - 1 : null,
        currentPage: +(page || 1),
      };

      return res.status(200).json({
        comments,
        pagination: {
          ...pagination,
          hasPrev,
          hasNext,
          maxPages,
          totalItems: totalComments,
        },
      });
    }
    if (req.method === "POST") {
      const { post_id } = req.query;
      if (!post_id || typeof post_id !== "string") {
        res.status(404).json({ message: "Invalid query params" });
      }
      const currentUser = await serverAuth(req, res);
      if (!currentUser) {
        return res.status(401).json({ message: "not signed in!" });
      }
      const userLocation = await prisma.field.findFirst({
        where: {
          userId: currentUser.currentUser.id,
          type: "LOCATION",
        },
      });
      const { body, hashtags, mentions, medias } = req.body;
      // validations for body data 
      if (body && body.trim().length === 0) {
        return res.status(400).json({ message: "Invalid comment!" });
      }
      if (!body && !!(!medias || medias!.length === 0)) {
        return res.status(400).json({ message: "Invalid media or comment!" });
      }
      const currentPost = await prisma.post.findUnique({
        where: {
          id: post_id as string,
        },
        include: {
          user: true,
        },
      });

      if (!currentPost) {
        return res.status(404).send("Not Found");
      }
      const targetPost = await prisma.post.findUnique({
        where: {
          id: post_id as string,
        },
      });
      const newPost = await prisma.post.create({
        data: {
          body: !!body ? body : "",
          parentId: currentPost.id,
          userId: currentUser.currentUser.id,
          parentUsername: currentPost.user.username,
        },
      });
      const comment = await prisma.comment.create({
        data: {
          userId: currentUser.currentUser.id,
          postId: newPost.id,
          body: !!body ? body : "",
          parentId: post_id as string,
        },
      });

      const allCommentIds = [...currentPost.commentIds, comment.id];

      await prisma.post.update({
        where: {
          id: comment.parentId,
        },
        data: {
          commentIds: allCommentIds,
        },
      });
      // handling tweet media media
      try {
        if (medias && medias?.length > 0) {
          const newMedias = await prisma.media
            .createMany({
              data: (medias as MediaType[]).map((m) => ({
                url: m.url,
                userId: currentUser.currentUser.id,
                postIds: [newPost.id],
                description: m.desc,
              })),
            })
            .then(async () => {
              return await prisma.media.findMany({
                where: {
                  userId: currentUser.currentUser.id,
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
            currentUser.currentUser.id,
            newPost.id,
            userLocation.value.toLowerCase(),
            hashtags || []
          );
        }
      } catch (error) {
        console.log("error in handling hashtags", error);
      }
      // handle post notification
      if (targetPost) {
        try {
          let mentionedUsers: string[] = without(
            mentions || [],
            currentUser.currentUser.id
          );

          const mentionAndUserComment = includes(
            mentionedUsers,
            targetPost.userId
          );
          const allowCreateNotif = !!(
            currentUser.currentUser.id === targetPost.userId &&
            mentionedUsers.length === 0
          );
          if (!allowCreateNotif) {
            await prisma.notification
              .createMany({
                data:
                  targetPost.userId !== currentUser.currentUser.id
                    ? [
                        ...mentionedUsers.map((id) => ({
                          body: `in case you missed it @${currentUser.currentUser.username} mentioned you on a reply`,
                          userId: id,
                          postId: targetPost.id,
                          actionUserId: currentUser.currentUser.id,
                          isSeen: false,
                          type: "MENTION",
                        })),
                        {
                          body: mentionAndUserComment
                            ? `in case you missed it @${currentUser.currentUser.username} replied and mentioned you on your tweet`
                            : `in case you missed it @${currentUser.currentUser.username} replied on your tweet`,
                          userId: targetPost.userId,
                          postId: targetPost.id,
                          actionUserId: currentUser.currentUser.id,
                          isSeen: false,
                          type: mentionAndUserComment ? "MENTION" : "COMMENT",
                        },
                      ]
                    : mentionedUsers.map((id) => ({
                        body: `in case you missed it @${currentUser.currentUser.username} mentioned you on its reply`,
                        userId: id,
                        postId: targetPost.id,
                        actionUserId: currentUser.currentUser.id,
                        isSeen: false,
                        type: "MENTION",
                      })),
              })
              .catch((err) => {
                console.log({ message: "error in creating notif", err });
              });
            await prisma.user
              .updateMany({
                where: {
                  id: {
                    in:
                      targetPost.userId !== currentUser.currentUser.id
                        ? [...mentionedUsers, targetPost.userId]
                        : mentionedUsers,
                  },
                },
                data: {
                  hasNotification: true,
                },
              })
              .catch((err) => {
                console.log({ message: "error in updating user notif" });
              });
          }
        } catch (error) {
          console.log("error in saving notification while commenting", error);
        }
      }

      return res.status(200).json({ message: "reply sent!", comment });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error happen for getting comments", error });
  }
}
