import { followerType } from "@/hooks/useFollowers";
import { User } from "@prisma/client";
import React, { useCallback, useMemo } from "react";
import Avatar from "../shared/Avatar";
import { format } from "date-fns";
import { useRouter } from "next/router";
import useFollow from "@/hooks/useFollow";
import { formatString } from "@/libs/wordDetector";
import Button from "../inputs/Button";
import { useEditModal } from "@/hooks/useEditModal";
import { includes } from "lodash";
import { BiCalendar } from "react-icons/bi";

const UserCard = ({
  user,
  currentUser,
}: {
  currentUser: User;
  user: followerType;
}) => {
  const router = useRouter();
  const editModal = useEditModal();
  const { isFollowing, toggleFollow, isLoading } = useFollow(user.id);

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();
      router.push(`/users/${user.id}`);
    },
    [router, user.id]
  );

  const createdAt = useMemo(() => {
    if (!user.createdAt) {
      return null;
    }
    return format(user.createdAt, "HH:mm . dd/MM/yy");
  }, [user.createdAt]);

  return (
    <article
      onClick={goToUser}
      className="min-w-full max-w-full border-b-[1px] border-b-neutral-800 p-3 flex justify-between items-start gap-2 hover:bg-neutral-800 hover:bg-opacity-60 cursor-pointer"
    >
      <section className="flex max-w-[65%] overflow-hidden gap-2 items-start justify-start">
        <Avatar userId={user.id} />
        <div className="flex flex-col items-start justify-start gap-1 w-[calc(100%-50px)]">
          <div className="flex flex-wrap  max-w-full items-center gap-1 justify-start capitalize">
            <p
              onClick={goToUser}
              className=" text-white font-semibold cursor-pointer hover:underline text-nowrap  "
            >
              {user.name}
            </p>
            <span
              onClick={goToUser}
              className=" text-neutral-500 hidden sm:block cursor-pointer hover:underline text-nowrap "
            >
              @{user.username}
            </span>
            <span className="text-neutral-500 flex items-center justify-center gap-1 sm:ms-2 text-sm text-nowrap whitespace-nowrap ">
              <BiCalendar size={14} />
              joined on {createdAt}
            </span>
          </div>
          {!!user.bio && (
            <p
              className="text-[15px] hidden sm:flex leading-normal line-clamp-3 capitalize whitespace-pre-wrap justify-start items-start text-neutral-200 w-full max-w-full font-light"
              dangerouslySetInnerHTML={{ __html: formatString(user.bio || "") }}
            ></p>
          )}
        </div>
      </section>
      {user?.id === currentUser.id ? (
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
        >
          {isFollowing
            ? "Unfollow"
            : includes((user as User).followingIds, currentUser?.id)
            ? "follow back"
            : "follow"}
        </Button>
      )}
    </article>
  );
};

export default UserCard;
