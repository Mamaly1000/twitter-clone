import { debounce } from "lodash";
import React from "react";
import useHashtags from "@/hooks/useHashtags";
import { useRouter } from "next/router";
import qs from "query-string";
import SearchInput from "../inputs/SearchInput";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
const HashtagSearchInput = () => {
  const router = useRouter();
  const { scrolled, isScrolling } = useScrollAnimation({});
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
    <motion.div
      animate={{
        top: scrolled && isScrolling ? 0 : "60px",
      }}
      className="min-w-full z-10 sticky py-2 bg-black max-h-full flex items-center justify-between px-3 my-3 border-b-[1px] border-neutral-800"
    >
      <SearchInput
        disabled={isLoading}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        autoFocus
        size={30}
        placeholder={"search #twitter"}
        inputClassName="min-w-[calc(100%-32px)] max-w-[calc(100%-32px)] text-lg bg-black"
      />
    </motion.div>
  );
};

export default HashtagSearchInput;
