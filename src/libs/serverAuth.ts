import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    console.log("checking session", session); 
    throw new Error("Not signed in");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    } as any,
  });

  if (!currentUser) {
    console.log("checking user", currentUser);

    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
