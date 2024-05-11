import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import useHashtags from "@/hooks/useHashtags";
import { useRouter } from "next/router";
import qs from "query-string";
import SearchInput from "../inputs/SearchInput";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
const HashtagSearchInput = () => {
  const router = useRouter();
  const [search, setSearch] = useState(router.query?.search || "");
  const { scrolled, isScrolling } = useScrollAnimation({});
  const { isLoading } = useHashtags({ search: router.query.search as string });

  const onSearch = debounce((val) => {
    const url = qs.stringifyUrl({
      url: "/hashtags",
      query:
        search.length === 0 || val === ""
          ? {}
          : {
              search: val,
            },
    });
    router.push(url);
  }, 1000);

  useEffect(() => {
    onSearch(search);
    return () => onSearch.cancel();
  }, [search]);

  return (
    <motion.div
      animate={{
        top: scrolled && isScrolling ? 0 : "50px",
      }}
      className="min-w-full z-10 sticky py-3 bg-light dark:bg-black max-h-full flex items-center justify-between px-3 mb-3 border-b-[1px] dark:border-neutral-800 border-neutral-300"
    >
      <SearchInput
        disabled={isLoading}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        autoFocus
        size={30}
        placeholder={"search #twitter"}
        inputClassName="min-w-[calc(100%-32px)] max-w-[calc(100%-32px)] text-lg bg-light dark:bg-black"
      />
    </motion.div>
  );
};

export default HashtagSearchInput;
