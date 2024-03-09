import React from "react";
import UsersList from "./UsersList";
import Link from "next/link";
import { motion } from "framer-motion";

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
      className="bg-[#16181C] text-[#D9D9D9] rounded-xl p-4 min-w-full flex flex-col items-start justify-start gap-3 max-w-full  "
    >
      <h2 className="min-w-full text-left text-[20px] capitalize font-[800] leading-6 text-[#e7e9ea]">
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
