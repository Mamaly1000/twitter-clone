import fetcher from "@/libs/fetcher";
import useSWR from "swr";
import { Media } from "@prisma/client";

const useMedias = (postId?: string) => {
  const url = postId ? `/api/posts/media/${postId}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return { Medias: (data || []) as Media[], error, isLoading, mutate };
};

export default useMedias;
