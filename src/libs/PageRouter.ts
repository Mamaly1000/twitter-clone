import { NextRouter } from "next/router";

export const PageRouter = (router: NextRouter, page: number) =>
  router.push(
    {
      query: {
        ...router.query,
        page: String(page),
      },
    },
    undefined,
    {
      scroll: false,
    }
  );
