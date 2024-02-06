import fetcher from "@/libs/fetcher";
import { Hashtag } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

const useHashtags = () => {
  const router = useRouter();
  const search = router.query.search as string;

  const { data, error, mutate, isLoading } = useSWR(
    `/api/hashtags?search=${search}`,
    fetcher
  );

  return {
    hashtags: (data?.hashtags || []) as Hashtag[],
    userHashtags: (data?.currentUserHashtags || []) as Hashtag[],
    error,
    isLoading,
    mutate,
  };
};

export default useHashtags;
