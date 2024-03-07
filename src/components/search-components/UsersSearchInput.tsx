import { debounce } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import qs from "query-string";
import useUsers, { usersParams } from "@/hooks/useUsers";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import SearchInput from "../inputs/SearchInput";
const UsersSearchInput = ({ params }: { params?: usersParams }) => {
  const router = useRouter();
  const { scrolled, isScrolling } = useScrollAnimation({});
  const { usersLoading } = useUsers(params);

  const onSearch = debounce((val) => {
    const url = qs.stringifyUrl({
      url: "/users",
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
        disabled={usersLoading}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        autoFocus
        size={30}
        placeholder={"search @someone"}
        inputClassName="min-w-[calc(100%-32px)] max-w-[calc(100%-32px)] text-lg bg-black"
      />
    </motion.div>
  );
};

export default UsersSearchInput;
