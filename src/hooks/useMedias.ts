import fetcher from "@/libs/fetcher";
import useSWR from "swr";
import { Media } from "@prisma/client";

const useMedias = (postId?: string | null) => {
  const url = postId ? `/api/posts/media/${postId}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
    errorRetryCount: 2,
  });
  return { Medias: (data || []) as Media[], error, isLoading, mutate };
};

export default useMedias;
