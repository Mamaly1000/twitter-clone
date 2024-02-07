import UsersList from "@/components/lists/UsersList";
import TrendHashtags from "@/components/shared/TrendHashtags";
import useRecommendedUsers from "@/hooks/useRecommendedUsers";
import useTrendHashtags from "@/hooks/useTrendHashtags";
import Link from "next/link";
import React from "react";

const FollowBar = () => {
  const { users } = useRecommendedUsers();
  const { hashtags } = useTrendHashtags();

  return (
    <div className="px-6 py-4 hidden xl:flex col-span-3 items-start justify-start flex-col gap-3  ">
      <div className="bg-[#202327] text-[#D9D9D9] rounded-xl p-4 min-w-full flex flex-col items-start justify-start gap-3 max-w-full  ">
        <h2 className="text-[20px] font-bold">Who to follow</h2>
        <UsersList users={users} />
        <Link
          href={"/users"}
          className="text-sky-500 text-[15px] font-bold hover:text-opacity-60"
        >
          show more
        </Link>
      </div>
      <TrendHashtags hashtags={hashtags || []} />
    </div>
  );
};

export default FollowBar;
