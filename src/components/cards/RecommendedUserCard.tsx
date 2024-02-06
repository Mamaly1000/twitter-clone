import { User } from "@prisma/client";
import React, { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import Avatar from "../shared/Avatar";
import Button from "../inputs/Button";
import useFollow from "@/hooks/useFollow";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/router";

const RecommendedUserCard = ({
  user,
  main,
}: {
  main?: boolean;
  user: User;
}) => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { toggleFollow, isLoading } = useFollow(user?.id);
  const goToUser = useCallback(() => {
    if (user.id) {
      router.push(`/users/${user.id}`);
    }
  }, [user.id, router]);
  return (
    <div onClick={goToUser}
      className={twMerge(
        "min-w-full flex items-center justify-between gap-2",
        main &&
          "px-3 border-b-[1px] border-neutral-800 py-2 cursor-pointer hover:bg-neutral-800 hover:bg-opacity-60"
      )}
    >
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
