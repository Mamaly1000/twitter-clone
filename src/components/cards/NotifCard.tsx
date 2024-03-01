import { Notification, Post, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Avatar from "../shared/Avatar";
import { formatString, getStringDirectionality } from "@/libs/wordDetector";
import NotifImage from "../shared/NotifImage";
import { BsClock } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import TweetImageList from "../lists/TweetImageList";
import { getShortUnit } from "@/libs/utils";

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

    const cd = formatDistanceToNowStrict(new Date(notif.createdAt)).split(" ");
    return cd[0] + "" + getShortUnit(cd[1]);
  }, [notif.createdAt]);

  const direction = useMemo(() => {
    return getStringDirectionality(notif?.post?.body || "");
  }, [notif.post?.body]);

  return (
    <div
      onClick={() =>
        router.push(
          notif.postId ? `/posts/${notif.postId}` : `/users/${notif.actionUser}`
        )
      }
      key={notif.id}
      className=" flex flex-row items-start justify-start py-2 px-3 gap-4 border-b-[1px] border-neutral-800 min-w-full max-w-full cursor-pointer hover:opacity-80 transition-all"
    >
      <NotifImage type={notif.type as any} />
      <section className="overflow-hidden flex items-start justify-between gap-3 md:flex-row flex-col max-w-[calc(100%-36px)] md:max-w-[calc(100%-46px)] min-w-[calc(100%-36px)] md:min-w-[calc(100%-46px)]">
        <div className=" min-w-full max-w-full md:min-w-[calc(100%-62px)] md:max-w-[calc(100%-62px)] overflow-hidden flex flex-col items-start justify-start gap-3 text-[12px] md:text-[15px]">
          {/* notif header */}
          <div className="flex flex-col md:flex-row items-start justify-start gap-2">
            <Avatar userId={notif.actionUser} />
            <div className="flex items-start justify-start flex-col text-white min-w-full max-w-full">
              <p className="flex items-center justify-start gap-1 flex-wrap text-lg capitalize">
                {notif.user.name}
                <span className="text-neutral-300 text-[12px] hover:underline">
                  @{notif.user.username}
                </span>
              </p>
              <p className="text-[12px] text-neutral-300">{notif.user.email}</p>
            </div>
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
        <span className="min-w-[50]  max-w-[50] text-neutral-500 text-sm flex items-center justify-start md:justify-end gap-1">
          <BsClock size={15} />
          {createdAt}
        </span>
      </section>
    </div>
  );
};

export default NotifCard;
