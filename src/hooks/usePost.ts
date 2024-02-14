import fetcher from "@/libs/fetcher";
import { Comment, Post, User } from "@prisma/client";
import useSWR from "swr";

const usePost = (id?: string) => {
  const url = !!id ? `/api/posts/${id}` : null;
  const {
    data: post,
    error,
    isLoading,
    mutate,
  } = useSWR(url, fetcher, {
    errorRetryCount: 2,
  });
  return {
    post: post as (Post & { user: User; comments: Comment[] }) | null,
    error,
    isLoading,
    mutate,
  };
};

export default usePost;
