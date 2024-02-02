import fetcher from "@/libs/fetcher";
import { Post } from "@prisma/client";
import useSWR from "swr";

const useBookmarks = (id?: string) => {
  const url = id ? `/api/profile/bookmarks/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    posts: (data || []) as Post[],
    error,
    isLoading,
    mutate,
  };
};

export default useBookmarks;
