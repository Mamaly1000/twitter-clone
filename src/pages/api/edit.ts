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

    const {
      name,
      username,
      bio,
      profileImage,
      coverImage,
      profileFields,
      location,
    } = req.body;

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
        bio: !!bio ? bio : currentUser.currentUser.bio,
        profileImage: !!profileImage
          ? profileImage
          : currentUser.currentUser.profileImage,
        coverImage: !!coverImage
          ? coverImage
          : currentUser.currentUser.coverImage,
      },
    });

    // updating current user location
    try {
      const currentUserLocation = await prisma.field.findFirst({
        where: {
          userId: updatedUser.id,
          type: "LOCATION",
        },
      });
      if (!!location && currentUserLocation) {
        await prisma.field.update({
          where: {
            id: currentUserLocation.id,
          },
          data: {
            value: (location as string).toLowerCase(),
          },
        });
      }
      if (!!location && !currentUserLocation) {
        await prisma.field.create({
          data: {
            value: (location as string).toLowerCase(),
            type: "LOCATION",
            userId: currentUser.currentUser.id,
          },
        });
      }
    } catch (error) {
      console.log("error in updating user location");
    }

    // handling user fields
    try {
      // deleting existed profile fields
      if (profileFields && profileFields.length > 0) {
        await prisma.field.deleteMany({
          where: {
            id: {
              in: currentUser.currentUser.profileFieldsIds,
            },
            type: {
              not: "LOCATION",
            },
          },
        });
        // creating new profile fields
        await prisma.field.createMany({
          data: profileFields.map((f: any) => ({
            type: f.type,
            value: f.value,
            userId: updatedUser.id,
          })),
        });
      }
      // finding fields which are related to user
      const updatedUserFields = await prisma.field.findMany({
        where: {
          userId: currentUser.currentUser.id,
        },
        select: {
          id: true,
        },
      });
      // updating user with new field ids
      await prisma.user.update({
        where: {
          id: currentUser.currentUser.id,
        },
        data: {
          profileFieldsIds: updatedUserFields.map((f) => f.id),
        },
      });
    } catch (error) {
      console.log("error in creating profile fields");
    }

    // checking existing cover image
    try {
      const existingCoverImage = await prisma.coverImage.findUnique({
        where: {
          userId: currentUser.currentUser.id,
        },
      });
      if (
        existingCoverImage &&
        updatedUser.coverImage &&
        updatedUser.coverImage !== existingCoverImage.imageUrl
      ) {
        await prisma.coverImage.update({
          where: {
            id: existingCoverImage.id,
          },
          data: {
            imageUrl: updatedUser.coverImage,
          },
        });
      }
      if (!existingCoverImage && updatedUser.coverImage) {
        await prisma.coverImage.create({
          data: {
            userId: updatedUser.id,
            imageUrl: updatedUser.coverImage,
          },
        });
      }
    } catch (error) {
      console.log("failed to add or update user coverimage");
    }

    return res
      .status(200)
      .json({ updatedUser, message: "Updated successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to update user profile", error });
  }
}
