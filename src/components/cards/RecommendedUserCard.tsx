import { User } from "@prisma/client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import Avatar from "../shared/Avatar";
import Button from "../inputs/Button";
import useFollow from "@/hooks/useFollow";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/router";
import { useEditModal } from "@/hooks/useEditModal";
import { includes } from "lodash";
import { HiOutlineUserAdd } from "react-icons/hi";
import { format } from "date-fns";
import { formatString } from "@/libs/wordDetector";

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

  const createdAt = useMemo(() => {
    if (!user.createdAt) {
      return null;
    }
    return format(user.createdAt, "yy/M/d");
  }, [user.createdAt]);

  useEffect(() => {
    const handleResize = () => {
      if (cardRef) {
        setScrollWidth(cardRef.current!.clientWidth);
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
          ? "px-3 border-b-[1px] border-neutral-300 dark:border-neutral-800 py-2 cursor-pointer dark:hover:bg-neutral-800  hover:bg-neutral-300 hover:bg-opacity-60 dark:hover:bg-opacity-60"
          : "px-0"
      )}
    >
      <div
        key={user.id}
        className={twMerge(
          "flex flex-row gap-4 cursor-default ",
          main && "w-full md:w-fit",
          !main && "max-w-[300px]"
        )}
      >
        <Avatar userId={user.id} />
        <div
          className={twMerge(
            "flex flex-col items-start justify-start gap-2",
            main && " min-w-[calc(100%-56px)] max-w-[calc(100%-56px)] "
          )}
        >
          <div
            className={twMerge(
              "flex items-center justify-start gap-2  ",
              main && " items-center justify-between md:justify-start",
              !main && "h-full"
            )}
          >
            <div className="flex h-full items-center justify-start gap-2 line-clamp-1">
              <p className="text-neutral-700 dark:text-[#D9D9D9] font-semibold text-[15px] capitalize whitespace-nowrap">
                {user.name!.length >= 7
                  ? user.name?.slice(0, 7) + "..."
                  : user.name}
              </p>
              {scrollWidth >= 250 && (
                <span className="text-neutral-400 dark:text-[#6E767D] text-[14px]  whitespace-nowrap">
                  {user.username!.length >= 6
                    ? "@" + user.username?.slice(0, 6) + "..."
                    : "@" + user.username}
                </span>
              )}
            </div>
            {main && (
              <span className="text-sm text-[#6E767D] float-right">
                {createdAt}
              </span>
            )}
          </div>
          {main && (
            <p
              className={twMerge(
                " line-clamp-1 text-sm text-neutral-600 dark:text-neutral-400 capitalize font-light",
                main ? " " : "hidden"
              )}
              dangerouslySetInnerHTML={{ __html: formatString(user.bio || "") }}
            ></p>
          )}
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
            outline
            className="hidden md:block"
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
            className="text-[13px] whitespace-nowrap min-w-[120px] hidden md:block"
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
          className="min-w-10 min-h-10 rounded-full flex items-center justify-center text-[#d9d9d9]  p-1 max-w-10"
          disabled={isLoading}
          onClick={toggleFollow}
        >
          <HiOutlineUserAdd />
        </Button>
      )}
    </div>
  );
};

export default RecommendedUserCard;
