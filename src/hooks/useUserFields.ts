import fetcher from "@/libs/fetcher"; 
import { Field } from "@prisma/client";
import useSWR from "swr";

const useUserFields = (id?: string) => {
  const url = id ? `/api/profile/fields/${id}` : null;
  const { data: fields, error, isLoading, mutate } = useSWR(url, fetcher);
  return { fields: (fields || []) as Field[], error, isLoading, mutate };
};

export default useUserFields;
