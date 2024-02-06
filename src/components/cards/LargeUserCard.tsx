import useCoverImage from "@/hooks/useCoverImage";
import useProfileImage from "@/hooks/useProfileImage";
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

const LargeUserCard = ({ user }: { user: User }) => {
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
      className="min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px] rounded-lg drop-shadow-2xl p-0 relative border-[1px] border-neutral-800 cursor-pointer hover:bg-neutral-800 hover:bg-opacity-50"
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
            className="absolute min-w-[70px] min-h-[70px] top-[-45px] border-[1px] border-black left-3"
          />
          {currentUser.id === user.id ? (
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
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow();
              }}
              className="bg-[#d9d9d9] text-black font-[400] text-[15px] border-none"
            >
              {isFollowing
                ? "followed"
                : user.followingIds.includes(currentUser?.id)
                ? "follow back"
                : "follow"}
            </Button>
          )}
        </div>
        <div className="min-w-full flex flex-col items-start justify-start px-3">
          <p className="text-white text-[15px] capitalize font-semibold">
            {user?.name}
          </p>
          <p className="text-[12px] text-neutral-500">@{user?.username}</p>
        </div>
        <p className="min-w-full text-neutral-300 text-sm max-w-full overflow-hidden text-left line-clamp-2 px-3">
          {user.bio}
        </p>
      </div>
    </article>
  );
};

export default LargeUserCard;
