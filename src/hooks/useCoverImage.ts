import fetcher from "@/libs/fetcher";
import { CoverImage, User } from "@prisma/client";
import useSWR from "swr";

const useCoverImage = (id: string) => {
  const url = id ? `/api/coverimage/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    coverImage: data as (CoverImage & { user: User }) | null,
    error,
    isLoading,
    mutate,
  };
};

export default useCoverImage;
