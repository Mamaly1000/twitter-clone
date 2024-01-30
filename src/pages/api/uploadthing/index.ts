import { createRouteHandler } from "uploadthing/next-legacy";
import { ourFileRouter } from "@/server/core";

const handler = createRouteHandler({
  router: ourFileRouter,
});

export default handler;
