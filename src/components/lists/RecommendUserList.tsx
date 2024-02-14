import React from "react";
import UsersList from "./UsersList";
import { User } from "@prisma/client";
import Link from "next/link";
import { isEmpty } from "lodash";

const RecommentUserList = ({
  users,
  title,
}: {
  users: User[];
  title?: string;
}) => {
  if (isEmpty(users)) {
    return null;
  }
  return (
    <div className="bg-[#16181C] text-[#D9D9D9] rounded-xl p-4 min-w-full flex flex-col items-start justify-start gap-3 max-w-full  ">
      <h2 className="min-w-full text-left text-[20px] capitalize font-[800] leading-6 text-[#e7e9ea]">
        {title || "Who to follow"}
      </h2>
      <UsersList users={users} />
      <Link
        href={"/users"}
        className="text-sky-500 text-[15px] font-bold hover:text-opacity-60"
      >
        show more
      </Link>
    </div>
  );
};

export default RecommentUserList;
