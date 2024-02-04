import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { email, username, password, name, location } = req.body;
    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existedUser) {
      try {
        const existedUserLocation = await prisma.field.findFirst({
          where: {
            type: "LOCATION",
            userId: existedUser.id,
          },
        });
        if (existedUserLocation) {
          await prisma.field.update({
            where: {
              id: existedUserLocation.id,
            },
            data: {
              type: "LOCATION",
              value: (location as string).toLowerCase(),
            },
          });
        }
      } catch (error) {
        console.log("error in updating user location");
      }

      return res.status(200).json({ message: "wellcome back" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
        username,
      },
    });
    if (user && !existedUser) {
      try {
        await prisma.field.create({
          data: {
            type: "LOCATION",
            value: location,
            userId: user.id,
          },
        });
      } catch (error) {
        console.log("error in creating user location");
      }
    }
    return res.status(200).json({
      user,
      message: user?.name ? `wellcome ${user.name}` : "wellcome to twitter",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
