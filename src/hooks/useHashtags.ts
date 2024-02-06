import fetcher from "@/libs/fetcher";
import { Hashtag } from "@prisma/client";
import useSWR from "swr";

const useHashtags = () => {
  const { data, error, mutate, isLoading } = useSWR("/api/hashtags", fetcher);

  return {
    hashtags: (data?.hashtags || []) as Hashtag[],
    userHashtags: (data?.currentUserHashtags || []) as Hashtag[],
    error,
    isLoading,
    mutate,
  };
};

export default useHashtags;
