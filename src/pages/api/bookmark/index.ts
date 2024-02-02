import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

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
    
  } catch (error) {
    console.log(`Error in user authentication: ${error}`);
  }
}
