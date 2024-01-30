import fetcher from "@/libs/fetcher";
import { Post } from "@prisma/client";
import useSWR from "swr";

const useLikedPosts = (id?: string) => {
  const url = id ? `/api/profile/liked-posts/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    likedPost: (data || []) as Post[],
    isLoading,
    error,
    mutate,
  };
};

export default useLikedPosts;
