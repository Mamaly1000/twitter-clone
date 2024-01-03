import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useNotif = (id?: string) => {
  const {
    data: notifs,
    error,
    mutate,
    isLoading,
  } = useSWR(id ? `/api/notifications/${id}` : null, fetcher);
  return { notifs, error, mutate, isLoading };
};

export default useNotif;
