import { User } from "@prisma/client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Avatar from "../shared/Avatar";
import Button from "../inputs/Button";
import useFollow from "@/hooks/useFollow";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/router"; 
import { useEditModal } from "@/hooks/useEditModal";
import { includes } from "lodash";
import { HiOutlineUserAdd } from "react-icons/hi";

const RecommendedUserCard = ({
  user,
  main,
}: {
  main?: boolean;
  user: User;
}) => {
  const router = useRouter();
  const editModal = useEditModal();
  const { data: currentUser } = useCurrentUser();
  const { toggleFollow, isLoading, isFollowing } = useFollow(user?.id);
  const goToUser = useCallback(() => {
    if (user.id) {
      router.push(`/users/${user.id}`);
    }
  }, [user.id, router]);
  const [scrollWidth, setScrollWidth] = useState(260);
  const cardRef: React.LegacyRef<HTMLDivElement> | undefined = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (cardRef) {
        setScrollWidth(cardRef.current!.offsetWidth);
      }
    };
    if (cardRef) {
      setScrollWidth(cardRef.current!.offsetWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollWidth, cardRef]);

  return (
    <div
      ref={cardRef}
      onClick={goToUser}
      className={twMerge(
        "min-w-full flex items-center justify-between gap-2 max-w-full overflow-hidden",
        main
          ? "px-3 border-b-[1px] border-neutral-800 py-2 cursor-pointer hover:bg-neutral-800 hover:bg-opacity-60"
          : "px-0"
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
          <p className="text-[#6E767D] text-[15px] text-nowrap line-clamp-1">
            @{user.username}
          </p>
        </div>
      </div>
      {main ? (
        user?.id === currentUser?.id ? (
          <Button
            secondary
            onClick={(e) => {
              e.stopPropagation();
              editModal.onOpen();
            }}
            disabled={isLoading}
          >
            Edit
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleFollow();
            }}
            secondary={!isFollowing}
            outline={isFollowing}
            disabled={isLoading}
            className="text-[13px] whitespace-nowrap min-w-[120px] "
          >
            {isFollowing
              ? "Unfollow"
              : includes((user as User).followingIds, currentUser?.id)
              ? "follow back"
              : "follow"}
          </Button>
        )
      ) : (
        <Button
          secondary
          outline
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#d9d9d9]  p-1 max-w-10"
          disabled={isLoading}
          onClick={toggleFollow}
        >
          <HiOutlineUserAdd  />
        </Button>
      )}
    </div>
  );
};

export default RecommendedUserCard;
