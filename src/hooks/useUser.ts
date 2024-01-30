import fetcher from "@/libs/fetcher";
import { Field, User } from "@prisma/client";
import useSWR from "swr";

export type mutualFollower = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  createdAt: Date;
  followingIds: string[];
  followerIds: string[];
};

const useUser = (user_id?: string) => {
  const url = user_id ? `/api/users/${user_id}` : null;

  const { data: user, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    user: user as
      | (User & {
          profileFields: Field[];
          posts: { id: string }[];
          mutualFollowers: mutualFollower[];
          mutualFollowersCount: number;
        })
      | null,
    error,
    isLoading,
    mutate,
  };
};

export default useUser;
