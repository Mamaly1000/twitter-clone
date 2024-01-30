import serverAuth from "@/libs/serverAuth";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req, res }) => {
      const user = await serverAuth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.currentUser.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
