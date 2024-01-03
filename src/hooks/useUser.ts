import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useUser = (user_id: string) => {
  const url = user_id ? `/api/users/${user_id}?` : null;

  const { data: user, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    user,
    error,
    isLoading,
    mutate,
  };
};

export default useUser;
