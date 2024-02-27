import useSWR from "swr";
import qs from "query-string";
import { useState } from "react";
import fetcher from "@/libs/fetcher";
const useEmoji = (show: boolean) => {
  const [search, setSearch] = useState("");
  const { data, error, isLoading, mutate } = useSWR(
    show
      ? qs.stringifyUrl({
          url: `https://emoji-api.com/emojis`,
          query: {
            search: search,
            access_key: process.env.NEXT_PUBLIC_EMOJI,
          },
        })
      : null,
    fetcher
  );
  const emojis:
    | {
        character: string;
        codePoint: string;
      }[] = data instanceof Array ? data : [];
  return {
    emojis,
    error,
    isLoading,
    mutate,
    setSearch,
    search,
  };
};

export default useEmoji;
