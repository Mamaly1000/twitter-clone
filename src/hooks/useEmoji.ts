import useSWR from "swr";
import qs from "query-string";
import { useState } from "react";
import fetcher from "@/libs/fetcher";
const useEmoji = (show: boolean) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<{
    disabled?: boolean | undefined;
    label: string;
    value: string;
  } | null>(null);
  const url = category
    ? `https://emoji-api.com/categories/${category.value}`
    : `https://emoji-api.com/emojis`;
  const { data, error, isLoading, mutate } = useSWR(
    show
      ? qs.stringifyUrl({
          url: url,
          query: {
            search: category ? null : search,
            access_key: process.env.NEXT_PUBLIC_EMOJI,
          },
        })
      : null,
    fetcher
  );
  const emojis: {
    character: string;
    unicodeName: string;
    codePoint: string;
  }[] = data instanceof Array ? data : [];
  return {
    emojis,
    error,
    isLoading,
    mutate,
    setSearch,
    search,
    setCategory,
    category,
  };
};

export default useEmoji;
