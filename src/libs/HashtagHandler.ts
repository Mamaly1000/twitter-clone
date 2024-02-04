import prisma from "@/libs/prisma";
import { filter, uniq } from "lodash";

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
        const availbleHashtagsNames = availableHashtags.map((h) =>
          h.name.toLowerCase()
        );
        const unAvailableHashtags = filter(
          hashtags,
          (h) => !availbleHashtagsNames.includes(h.toLowerCase())
        );
        // update Available Hashtags
        if (availbleHashtagsNames) {
          availableHashtags.forEach(async (h) => {
            await prisma.hashtag
              .update({
                where: {
                  id: h.id,
                },
                data: {
                  userIds: uniq([...h.userIds, userId]),
                  postIds: uniq([...h.postIds, postId]),
                  count: uniq([...h.postIds, postId]).length,
                },
              })
              .catch((reason) => {
                console.log(`Error in updating the ${h.name} hashtag`, reason);
              });
          });
        }
        // create Unavailable Hashtags
        if (unAvailableHashtags.length > 0) {
          await prisma.hashtag
            .createMany({
              data: unAvailableHashtags.map((h) => ({
                name: h.toLowerCase(),
                location: location.toLowerCase(),
                userIds: [userId],
                postIds: [postId],
                count: 1,
              })),
            })
            .catch((reason) => {
              console.log("error in creating unavailable hashtags", reason);
            });
        }
      }
      if (availableHashtags.length === 0) {
        // create hashtags
        await prisma.hashtag
          .createMany({
            data: hashtags.map((h) => ({
              location: location,
              name: h,
              userIds: [userId],
              postIds: [postId],
              count: 1,
            })),
          })
          .catch((reason) => {
            console.log("error in creating hashtags", reason);
          });
      }
    }
  } catch (error) {
    console.log("error in updating or adding hashtags");
  }
};

export default HashtagHandler;
