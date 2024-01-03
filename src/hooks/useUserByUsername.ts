import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useUserByUsername = (username?: string) => {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(username ? `/api/users?username=${username}` : null, fetcher);
  return { user, error, isLoading, mutate };
};

export default useUserByUsername;
