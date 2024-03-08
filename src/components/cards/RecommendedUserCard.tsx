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
        className={twMerge(
          "flex flex-row gap-4 cursor-default ",
          main && "w-full md:w-fit"
        )}
      >
        <Avatar userId={user.id} />
        <div
          className={twMerge(
            "flex flex-col items-start justify-start gap-2 ",
            main && " min-w-[calc(100%-56px)] max-w-[calc(100%-56px)]"
          )}
        >
          <div
            className={twMerge(
              "flex min-w-full max-w-full justify-start gap-2",
              main
                ? "flex-wrap items-center justify-between md:justify-start"
                : "flex-col items-start"
            )}
          >
            <p className="text-[#D9D9D9] font-semibold text-[15px] capitalize line-clamp-1 flex flex-wrap items-center justify-start gap-2">
              {user.name}
              <span className="text-[#6E767D] text-[15px] text-nowrap line-clamp-1">
                @{user.username}
              </span>
            </p>

            {main && (
              <span className="text-sm text-[#6E767D] float-right">
                {createdAt}
              </span>
            )}
          </div>
          {main && (
            <p
              className={twMerge(
                " line-clamp-1 text-sm text-neutral-400 capitalize font-light",
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
