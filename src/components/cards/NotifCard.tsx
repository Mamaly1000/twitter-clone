import { Notification, Post, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import Avatar from "../shared/Avatar";
import { formatString, getStringDirectionality } from "@/libs/wordDetector";
import NotifImage from "../shared/NotifImage";
import { BsClock } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import TweetImageList from "../lists/TweetImageList";
import { getShortUnit } from "@/libs/utils";
import { motion } from "framer-motion";
import useNotif from "@/hooks/useNotif";
import DropDown, { DropDownItemType } from "../ui/DropDown";
import { BiDotsHorizontal } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelectedDropdown } from "@/hooks/useSelectDropdown";

const NotifCard = ({
  notif,
}: {
  notif: Notification & { user: User; post: Post & { user: User } };
}) => {
  const {
    postId: selectedDropdownPostId,
    onClose: onClosePostDropDown,
    onSelect,
  } = useSelectedDropdown();
  const [isLoading, setLoading] = useState(false);
  const { mutate } = useNotif();

  const [deleted, setDeleted] = useState(false);
  const router = useRouter();

  const createdAt = useMemo(() => {
    if (!notif?.createdAt) {
      return null;
    }

    const cd = formatDistanceToNowStrict(new Date(notif.createdAt)).split(" ");
    return cd[0] + "" + getShortUnit(cd[1]);
  }, [notif.createdAt]);

  const direction = useMemo(() => {
    return getStringDirectionality(notif?.post?.body || "");
  }, [notif.post?.body]);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios
        .delete(`/api/notifications/delete/${notif?.id}`)
        .then((res) => {
          mutate();
          setDeleted(true);
          toast.success(res.data.message);
        });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const onDropDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (selectedDropdownPostId !== notif?.id && notif?.id) {
        onSelect(notif?.id);
      } else {
        onClosePostDropDown();
      }
    },
    [notif?.id, selectedDropdownPostId, onClosePostDropDown, onSelect]
  );
  const DropDownOptions: DropDownItemType[] = useMemo(() => {
    return [
      {
        Icon: FiDelete,
        label: "delete notification",
        onClick: () => onDelete(),
        disabled: isLoading,
      },
    ];
  }, [notif.id, onDelete, isLoading]);
  return (
    <motion.article
      animate={{
        translateX: deleted ? 1000 : 0,
        opacity: deleted ? 0 : 1,
        display: deleted ? "none" : "flex",
      }}
      transition={{
        duration: 0.12,
        ease: "linear",
        display: {
          delay: 0.15,
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (notif?.id === selectedDropdownPostId) {
          onClosePostDropDown();
        } else {
          router.push(
            notif.postId
              ? `/posts/${notif.postId}`
              : `/users/${notif.actionUserId}`
          );
        }
      }}
      key={notif.id}
      className={twMerge(
        "flex flex-row items-start justify-start py-2 px-3 gap-4 border-b-[1px] border-neutral-300 dark:border-neutral-800 min-w-full max-w-full cursor-pointer hover:opacity-80 transition-all",
        !notif.isSeen ? "bg-sky-900 bg-opacity-40" : ""
      )}
    >
      <div className="w-fit max-w-fit flex items-start justify-start flex-col gap-2">
        <NotifImage type={notif.type as any} />
      </div>
      <section className="overflow-hidden flex items-start justify-between gap-3 md:flex-row flex-col max-w-[calc(100%-36px)] md:max-w-[calc(100%-46px)] min-w-[calc(100%-36px)] md:min-w-[calc(100%-46px)]">
        <div className="min-w-full max-w-full md:min-w-[calc(100%-109px)] md:max-w-[calc(100%-109px)] overflow-hidden flex flex-col items-start justify-start gap-3 text-[12px] md:text-[15px]">
          {/* notif header */}
          <div className="flex min-w-full max-w-full  flex-row line-clamp-1 text-nowrap whitespace-nowrap items-start justify-start gap-2">
            <Avatar userId={notif.actionUserId} />
            <div className="flex items-start justify-start flex-col text-white min-w-[calc(100%-91px)] max-w-[calc(100%-91px)]">
              <p className="flex items-center justify-start gap-1 flex-wrap text-lg capitalize">
                {notif.user.name}
                <span className="text-neutral-300 text-[12px] hover:underline">
                  @{notif.user.username}
                </span>
              </p>
              <p className="text-[12px] text-neutral-300">{notif.user.email}</p>
            </div>
            <DropDown
              onDropDown={onDropDown}
              display={selectedDropdownPostId === notif?.id}
              onClose={onClosePostDropDown}
              position="right-0 top-0 "
              className=" md:hidden text-[18px]"
              options={DropDownOptions}
            >
              <BiDotsHorizontal size={15} />
            </DropDown>
          </div>
          {/* notif content */}
          <div className="flex flex-col items-start justify-start min-w-full max-w-full ">
            {/* notif body */}
            <p
              className="text-neutral-300 capitalize text-[15px] text-wrap max-w-full min-w-full line-clamp-3"
              dangerouslySetInnerHTML={{ __html: formatString(notif.body) }}
            ></p>
            {notif.post && (
              <div
                className={twMerge(
                  "min-w-full max-w-full ",
                  "p-2 rounded-lg mt-2 flex flex-col text-start justify-start border-[1px] border-neutral-800"
                )}
              >
                {/* notif post header */}
                <div className="min-w-full max-w-full flex flex-col md:flex-row items-start justify-start gap-2 pt-2 pb-1">
                  <Avatar userId={notif.post.userId} />
                  <div className="flex items-start justify-start flex-col text-sm text-white">
                    <p className="flex items-center justify-start gap-1 flex-wrap capitalize">
                      {notif.post.user.name}
                      <span className="text-neutral-300 text-[10px] hover:underline">
                        @{notif.post.user.username}
                      </span>
                    </p>
                    <p className="text-[11px] text-neutral-300">
                      {notif.post.user.email}
                    </p>
                  </div>
                </div>
                {!!notif.post.body ? (
                  <p
                    style={{
                      direction: direction.dir,
                    }}
                    className={twMerge(
                      "text-neutral-200 min-w-full text-sm max-w-full text-wrap line-clamp-3",
                      direction.className
                    )}
                    dangerouslySetInnerHTML={{
                      __html: formatString(notif.post.body),
                    }}
                  ></p>
                ) : (
                  <TweetImageList
                    className="min-w-full max-w-full"
                    postId={notif.post.id}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <span className="min-w-[50px]  md:pt-2 max-w-[50px] text-neutral-500 text-sm flex items-center justify-start md:justify-end gap-1">
          <BsClock size={15} />
          {createdAt}
        </span>
        <DropDown
          onDropDown={onDropDown}
          display={selectedDropdownPostId === notif?.id}
          onClose={onClosePostDropDown}
          position="right-0 top-0 "
          className="hidden md:block"
          options={DropDownOptions}
        >
          <BiDotsHorizontal />
        </DropDown>
      </section>
    </motion.article>
  );
};

export default NotifCard;
