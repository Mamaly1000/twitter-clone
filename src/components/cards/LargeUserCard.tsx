import useCoverImage from "@/hooks/useCoverImage";
import { User } from "@prisma/client";
import Image from "next/image";
import React, { useCallback } from "react";
import placeholder from "../../../public/images/placeholder.jpg";
import Avatar from "../shared/Avatar";
import useFollow from "@/hooks/useFollow";
import Button from "../inputs/Button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEditModal } from "@/hooks/useEditModal";
import { useRouter } from "next/router";
import MutualFollowers from "../lists/MutualFollowers";
import { mutualFollower } from "@/hooks/useUser";
import { twMerge } from "tailwind-merge";

const LargeUserCard = ({
  user,
  main,
  mutuals,
}: {
  mutuals?: {
    mutualFollowers: mutualFollower[];
    mutualFollowersCount: number;
  };
  main?: boolean;
  user: User;
}) => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { coverImage } = useCoverImage(user.id);
  const {
    isFollowing,
    toggleFollow,
    isLoading: followingLoading,
  } = useFollow(user.id);
  const editModal = useEditModal();
  const goToUser = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (user.id) {
        router.push(`/users/${user.id}`);
      }
    },
    [user.id]
  );
  return (
    <article
      onClick={goToUser}
      className={twMerge(
        `min-w-[300px] max-w-[300px] min-h-[300px] 
        rounded-lg drop-shadow-2xl p-0 relative 
        border-[1px] border-neutral-300 dark:border-neutral-800 cursor-pointer
         dark:hover:bg-neutral-800 dark:hover:bg-opacity-50
         hover:bg-slate-200 hover:bg-opacity-50
         `,
        main ? "max-h-fit" : "max-h-[300px]"
      )}
    >
      <div className="aspect-video min-w-full max-w-full overflow-hidden rounded-t-lg min-h-[130px] max-h-[130px] relative">
        <Image
          src={coverImage?.imageUrl || placeholder.src}
          alt={coverImage?.user?.username || ""}
          fill
          className="object-cover"
        />
      </div>
      <div className=" min-w-full max-w-full relative flex flex-col items-start justify-start gap-3 z-10 py-3">
        <div className="min-w-full max-w-full flex items-center justify-end gap-2 px-3  relative">
          <Avatar
            userId={user.id}
            className="absolute min-w-[70px] min-h-[70px] top-[-45px] border-[3px] left-3"
          />
          {currentUser?.id === user.id ? (
            <Button
              secondary
              onClick={(e) => {
                e.stopPropagation();
                editModal.onOpen();
              }}
            >
              Edit profile
            </Button>
          ) : (
            <Button
              disabled={followingLoading}
              onClick={toggleFollow}
              className=" font-[400] bg-black border-slate-200"
            >
              {isFollowing
                ? "following"
                : user.followingIds.includes(currentUser?.id)
                ? "follow back"
                : "follow"}
            </Button>
          )}
        </div>
        <div className="min-w-full flex flex-col items-start justify-start px-3">
          <p className=" text-text-primary dark:text-white text-[15px] capitalize font-semibold">
            {user?.name}
          </p>
          <p className="text-[12px] text-neutral-500">@{user?.username}</p>
        </div>
        <p className="min-w-full text-neutral-500 dark:text-neutral-300 text-sm max-w-full overflow-hidden text-left line-clamp-2 px-3">
          {user.bio}
        </p>
      </div>
      {main && mutuals && (
        <div className="min-w-full max-w-full flex flex-col items-start justify-start gap-2 pb-3 px-3">
          <div className="items-center justify-start gap-2 flex ">
            <div className="flex flex-row items-center gap-1">
              <p className="text-text-primary dark:text-white">
                {user?.followingIds?.length}
              </p>
              <p className="text-neutral-400 dark:text-neutral-500">
                Following
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <p className="text-text-primary dark:text-white">
                {user!.followerIds.length || 0}
              </p>
              <p className="text-neutral-400 dark:text-neutral-500">
                Followers
              </p>
            </div>
          </div>
          <MutualFollowers
            others={mutuals?.mutualFollowersCount}
            followers={mutuals?.mutualFollowers}
          />
        </div>
      )}
    </article>
  );
};

export default LargeUserCard;
