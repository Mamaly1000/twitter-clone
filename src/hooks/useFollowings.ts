import fetcher from "@/libs/fetcher";
import useSWR from "swr";

export type followerType = {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  email: string | null;
  createdAt: Date;
  followingIds: string[];
  followerIds: string[];
};

const useFollowings = (id?: string) => {
  const url = id ? `/api/profile/followings/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    followings: (data || []) as followerType[],
    error,
    isLoading,
    mutate,
  };
};

export default useFollowings;
