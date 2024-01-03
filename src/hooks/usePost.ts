import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const usePost = (id?: string) => {
  const url = !!id ? `/api/posts/${id}` : null;
  const { data: post, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    post,
    error,
    isLoading,
    mutate,
  };
};

export default usePost;
