import fetcher from "@/libs/fetcher";
import { Post } from "@prisma/client";
import useSWR from "swr";

const useReplies = (id?: string) => {
  const url = id ? `/api/profile/replies/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return { replies: (data || []) as Post[], error, isLoading, mutate };
};

export default useReplies;
