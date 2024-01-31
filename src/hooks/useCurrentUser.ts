import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { User } from "@prisma/client";
const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);

  return {
    data: data as User & {
      mutualReplies: {
        user: {
          id: string;
          name: string | null;
          username: string | null;
        };
        id: string;
        postId: string;
        body: string;
        createdAt: Date;
      }[];
    },

    error,
    isLoading,
    mutate,
  };
};
export default useCurrentUser;
