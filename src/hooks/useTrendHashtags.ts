import fetcher from "@/libs/fetcher";
import { Hashtag } from "@prisma/client";
import useSWR from "swr";

const useTrendHashtags = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/hashtags/trend",
    fetcher
  );
  return { hashtags: (data || []) as Hashtag[], error, isLoading, mutate };
};

export default useTrendHashtags;
