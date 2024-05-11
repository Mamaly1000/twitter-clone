import React from "react";
import UsersList from "./UsersList";
import Link from "next/link";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const RecommentUserList = ({ title }: { title?: string }) => {
  return (
    <motion.div
      initial={{
        translateX: 100,
        opacity: 0,
      }}
      animate={{
        translateX: 0,
        opacity: 100,
      }}
      className={twMerge(
        `bg-transparent dark:bg-[#16181C] text-text-primary dark:text-[#D9D9D9]
         rounded-xl p-4 min-w-full flex flex-col items-start justify-start gap-3 max-w-full 
         border-[1px] border-neutral-300 dark:border-[#16181C] `
      )}
    >
      <h2 className="min-w-full text-left text-[20px] capitalize font-[800] leading-6 text-text-primary dark:text-[#e7e9ea]">
        {title || "Who to follow"}
      </h2>
      <UsersList
        emptyType="users"
        params={{
          type: "recommended",
        }}
      />
      <Link
        href={"/users"}
        className="text-sky-500 text-[15px] font-bold hover:text-opacity-60"
      >
        show more
      </Link>
    </motion.div>
  );
};

export default RecommentUserList;
