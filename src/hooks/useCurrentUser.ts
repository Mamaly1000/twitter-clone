import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { User } from "@prisma/client";
const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);

  return {
    data: data as User | null,
    error,
    isLoading,
    mutate,
  };
};
export default useCurrentUser;
