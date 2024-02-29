import { debounce } from "lodash";
import React, { useState } from "react";
import useHashtags from "@/hooks/useHashtags";
import { useRouter } from "next/router";
import qs from "query-string";
const HashtagSearchInput = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoading } = useHashtags({ search: router.query.search as string });

  const onSearch = debounce((val) => {
    const url = qs.stringifyUrl({
      url: "/hashtags",
      query: {
        search: val,
      },
    });
    router.push(url);
  }, 1000);

  return (
    <div className="min-w-full max-h-full flex items-center justify-between">
      <input
        disabled={isLoading}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        placeholder={"search #twitter"}
        type={"text"}
        className="w-full p-4 text-lg bg-black border-2 border-neutral-800 outline-none text-white focus:border-sky-500 focus:border-2 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed "
      />
    </div>
  );
};

export default HashtagSearchInput;
