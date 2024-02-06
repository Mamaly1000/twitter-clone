import fetcher from "@/libs/fetcher";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

const useUsers = () => {
  const router = useRouter();
  const search = router.query.search as string;
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/users?search=${search}`, fetcher);

  return {
    users: (!!users && users.length > 0 ? users : []) as User[],
    error,
    isLoading,
    mutate,
  };
};

export default useUsers;
