import fetcher from "@/libs/fetcher";
import useSWR from "swr";

const useUserLocation = (id?: string) => {
  const url = id ? `/api/profile/location/${id}` : null;
  const { data: location, error, isLoading, mutate } = useSWR(url, fetcher);
  return { location: location as string | null, error, isLoading, mutate };
};

export default useUserLocation;
