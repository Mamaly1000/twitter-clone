import prisma from "@/libs/prisma";
import { filter } from "lodash";

const HashtagHandler = async (
  userId: string,
  postId: string,
  location: string,
  hashtags?: string[]
) => {
  try {
    if (hashtags && hashtags.length > 0) {
      const availableHashtags = await prisma.hashtag.findMany({
        where: {
          AND: [
            {
              name: {
                in: hashtags.map((h) => h.toLowerCase()),
              },
            },
            { location: location.toLowerCase() },
          ],
        },
      });
      if (!availableHashtags) {
        console.log(
          "error in finding available hashtags : ",
          availableHashtags
        );
      }
      if (availableHashtags.length > 0) {
        // update available hashtags
        const availbleHashtagsNames = availableHashtags.map((h) => h.name);
        const unAvailableHashtags = filter(
          hashtags,
          (h) => !availbleHashtagsNames.includes(h)
        );
        const updatedAvailableHashtags = await prisma.hashtag.updateMany({
          where: {
            AND: [
              { name: { in: availbleHashtagsNames } },
              { location: location },
            ],
          },
          data: availableHashtags.map((h) => ({
            name: h.name,
            location: h.location,
            userIds: Array.from(new Set([...h.userIds, userId])),
            postIds: Array.from(new Set([...h.postIds, postId])),
          })),
        });
        const createUnavailableHashtags = await prisma.hashtag.createMany({
          data: unAvailableHashtags.map((h) => ({
            name: h,
            location: location,
            userIds: [userId],
            postIds: [postId],
          })),
        });
        if (!updatedAvailableHashtags) {
          console.log("error in updating available hashtags");
        }
        if (!createUnavailableHashtags) {
          console.log("error in creating unavailable hashtags");
        }
      }
      if (availableHashtags.length === 0) {
        // create hashtags
        const createHashtags = await prisma.hashtag.createMany({
          data: hashtags.map((h) => ({
            location: location,
            name: h,
            userIds: [userId],
            postIds: [postId],
          })),
        });
      }
    }
  } catch (error) {
    console.log("error in updating or adding hashtags");
  }
};

export default HashtagHandler;
