import { Notification, Post, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Avatar from "../shared/Avatar";
import { formatString } from "@/libs/wordDetector";
import NotifImage from "../shared/NotifImage";
import { BsClock } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

const NotifCard = ({
  notif,
}: {
  notif: Notification & { user: User; post: Post & { user: User } };
}) => {
  const router = useRouter();
  const createdAt = useMemo(() => {
    if (!notif?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(notif.createdAt));
  }, [notif.createdAt]);
  return (
    <div
      onClick={() =>
        router.push(
          notif.postId ? `/posts/${notif.postId}` : `/users/${notif.actionUser}`
        )
      }
      key={notif.id}
      className=" flex flex-row items-start justify-start p-6 gap-4 border-b-[1px] border-neutral-800 min-w-full cursor-pointer hover:opacity-80 transition-all"
    >
      <NotifImage type={notif.type} />
      <section className="flex max-w-[calc(100%-60px)] min-w-[calc(100%-60px)]  items-start justify-between gap-3   md:flex-row flex-col">
        <div className="flex flex-col items-center justify-start gap-3 text-[12px] md:text-[15px]  md:max-w-[calc(100%-200px)]  ">
          <div className="w-full flex flex-col md:flex-row items-start justify-start gap-2">
            <Avatar userId={notif.actionUser} />
            <div className="flex items-start justify-start flex-col text-white">
              <p className="flex items-center justify-start gap-1 flex-wrap text-lg capitalize">
                {notif.user.name}
                <span className="text-neutral-300 text-[12px] hover:underline">
                  @{notif.user.username}
                </span>
              </p>
              <p className="text-[12px] text-neutral-300">{notif.user.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start">
            <p
              className="text-neutral-300 capitalize text-[15px] "
              dangerouslySetInnerHTML={{ __html: formatString(notif.body) }}
            ></p>
            {notif.post && (
              <div
                className={twMerge(
                  notif.type === "LIKE" || notif.type === "DISLIKE"
                    ? "p-3 rounded-lg mt-2 ms-2 min-w-full flex flex-col text-start justify-start border-[1px] border-neutral-800"
                    : ""
                )}
              >
                {!!(notif.type === "LIKE" || notif.type === "DISLIKE") && (
                  <div className="w-full flex flex-col md:flex-row items-start justify-start gap-2 pt-2 pb-1">
                    <Avatar
                      className="w-[35px] h-[35px]  max-w-[35px] min-w-[35px] min-h-[35px] max-h-[35px] "
                      userId={notif.post.userId}
                    />
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
                )}
                <p
                  className="text-neutral-200 min-w-full text-sm "
                  dangerouslySetInnerHTML={{
                    __html: formatString(notif.post.body),
                  }}
                ></p>
              </div>
            )}
          </div>
        </div>
        <span className="text-neutral-500 text-sm min-w-fit flex items-center justify-center gap-1">
          <BsClock size={15} />
          {createdAt} ago
        </span>
      </section>
    </div>
  );
};

export default NotifCard;
