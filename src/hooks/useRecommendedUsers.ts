import fetcher from "@/libs/fetcher";
import { User } from "@prisma/client";
import useSWR from "swr";

const useRecommendedUsers = () => {
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/users/recommend", fetcher);
  return {
    users: (users || []) as User[],
    error,
    isLoading,
    mutate,
  };
};

export default useRecommendedUsers;
