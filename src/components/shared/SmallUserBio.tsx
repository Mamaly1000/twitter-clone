import useCurrentUser from "@/hooks/useCurrentUser";
import React from "react";
import Avatar from "./Avatar";
import { formatNumbersWithCommas } from "@/libs/wordDetector";

const SmallUserBio = () => {
  const { data: user } = useCurrentUser();
  if (!user) {
    return null;
  }
  return (
    <section className="min-w-full flex flex-col items-start justify-start gap-5 ps-4">
      <Avatar userId={user.id} />
      <div className="flex flex-col items-start justify-start leading-[20px] ">
        <p className="text-[18px] font-bold text-text-primary dark:text-[#d9d9d9] ">
          {user.name}
        </p>
        <p className="text-[14px] text-neutral-500 dark:text-neutral-300 ">
          @{user.username}
        </p>
      </div>
      <div className="min-w-full flex items-start text-[14px] justify-start gap-2">
        <p className="flex items-center  text-neutral-700 dark:text-[#d9d9d9] justify-center gap-1">
          {formatNumbersWithCommas(`${user.followingIds.length}`)}{" "}
          <span className="text-neutral-400 ">followings</span>
        </p>
        <p className="flex items-center text-neutral-700 dark:text-[#d9d9d9] justify-center gap-1">
          {formatNumbersWithCommas(`${user.followerIds.length}`)}{" "}
          <span className="text-neutral-400">followers</span>
        </p>
      </div>
    </section>
  );
};

export default SmallUserBio;
