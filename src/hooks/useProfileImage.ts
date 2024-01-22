import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useProfileImage = (id?: string) => {
  const url = id ? `/api/profile/${id}` : null;
  const { data: user, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    user: user as {
      id: string;
      username: string | null;
      profileImage: string | null;
    } | null,
    error,
    isLoading,
    mutate,
  };
};

export default useProfileImage;
