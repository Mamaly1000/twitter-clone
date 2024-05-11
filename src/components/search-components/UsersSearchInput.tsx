import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import qs from "query-string";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import SearchInput from "../inputs/SearchInput";
import useUsers from "@/hooks/useUsers";
const UsersSearchInput = () => {
  const router = useRouter();

  const [search, setSearch] = useState(router.query?.search || "");
  const { scrolled, isScrolling } = useScrollAnimation({});
  const { usersLoading } = useUsers({ search: router.query?.search as string });

  const onSearch = debounce((val) => {
    const url = qs.stringifyUrl({
      url: "/users",
      query:
        search.length === 0 || String(val).trim() === ""
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
      className="min-w-full z-10 sticky py-2 bg-light dark:bg-black max-h-full flex items-center justify-between px-3 mb-3 border-b-[1px] border-neutral-300 dark:border-neutral-800 "
    >
      <SearchInput
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        disabled={usersLoading}
        autoFocus
        size={30}
        placeholder={"search @someone"}
        inputClassName="min-w-[calc(100%-32px)] max-w-[calc(100%-32px)] text-lg bg-light dark:bg-black"
      />
    </motion.div>
  );
};

export default UsersSearchInput;
