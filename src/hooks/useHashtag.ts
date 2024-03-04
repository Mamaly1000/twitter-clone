import fetcher from "@/libs/fetcher";
import { Hashtag, Post, User } from "@prisma/client";
import useSWR from "swr";

const useHashtag = (id?: string) => {
  const url = id ? `/api/hashtags/${id}` : null;
  const { data, error, mutate, isLoading } = useSWR(url, fetcher);
  return {
    hashtag: data?.hashtags as Hashtag | null,
    users: (data?.users || []) as User[], 
    error,
    mutate,
    isLoading,
  };
};

export default useHashtag;
