import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useUsers = () => {
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/users`, fetcher);

  return {
    users: !!users && users.length > 0 ? users : [],
    error,
    isLoading,
    mutate,
  };
};

export default useUsers;
