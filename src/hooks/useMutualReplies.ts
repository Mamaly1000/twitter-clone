import fetcher from "@/libs/fetcher";
import { Post } from "@prisma/client";
import useSWR from "swr";

const useMutualReplies = (postId?: string) => {
  const url = postId ? `/api/posts/mutual/${postId}` : null;
  const { data, isLoading, mutate, error } = useSWR(url, fetcher);
  return {
    mutualReplies: data as Array<
      Post & {
        user: {
          id: string;
          name: string | null;
          email: string | null;
          createdAt: Date;
          username: string | null;
          followingIds: string[];
        };
      }
    >,
    isLoading,
    mutate,
    error,
  };
};

export default useMutualReplies;
