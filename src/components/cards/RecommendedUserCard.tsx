import { User } from "@prisma/client";
import React from "react";
import { twMerge } from "tailwind-merge";
import Avatar from "../shared/Avatar";
import Button from "../inputs/Button";
import useFollow from "@/hooks/useFollow";
import useCurrentUser from "@/hooks/useCurrentUser";

const RecommendedUserCard = ({ user }: { user: User }) => {
  const { data: currentUser } = useCurrentUser();
  const { toggleFollow, isLoading } = useFollow(user?.id);
  return (
    <div className="min-w-full flex items-center justify-between gap-2">
      <div
        key={user.id}
        className={twMerge("flex flex-row gap-4 cursor-default ")}
      >
        <Avatar
          className="min-w-[48px] max-w-[48px] w-[48px] h-[48px] max-h-[48px] min-h-[48px] "
          userId={user.id}
        />
        <div className="flex flex-col ">
          <p className="text-[#D9D9D9] font-semibold text-[15px] capitalize line-clamp-1">
            {user.name}
          </p>
          <p className="text-[#6E767D] text-[15px]">@{user.username}</p>
        </div>
      </div>
      <Button
        disabled={isLoading}
        className="text-[14px] font-[500] capitalize bg-[#D9D9D9] text-[#0F1419] border-none py-2 px-3"
        onClick={toggleFollow}
      >
        {currentUser && user.followingIds.includes(currentUser?.id)
          ? "follow back"
          : "follow"}
      </Button>
    </div>
  );
};

export default RecommendedUserCard;
