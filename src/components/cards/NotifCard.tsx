import useUserByUsername from "@/hooks/useUserByUsername";
import { Notification } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Avatar from "../shared/Avatar";

const NotifCard = ({ notif }: { notif: Notification }) => {
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
          notif.postId ? `/posts/${notif.postId}` : `/users/${notif.userId}`
        )
      }
      key={notif.id}
      className="flex flex-row items-center justify-between p-6 gap-4 border-b-[1px] border-neutral-800 min-w-full cursor-pointer hover:opacity-80 transition-all"
    >
      <div className="flex items-center justify-start gap-3 text-[12px] md:text-[15px]">
        <Avatar userId={notif.userId} />
        <p className="text-white">
          <span
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/users/${notif.userId}`);
            }}
            className="text-sky-300 font-bold"
          >
            {notif.body.split(" ").find((word) => word.includes("@"))}{" "}
          </span>
          {notif.body
            .split(" ")
            .filter((word) => !word.includes("@"))
            .join(" ")}
        </p>
      </div>
      <span className="text-neutral-500 text-sm">{createdAt}</span>
    </div>
  );
};

export default NotifCard;
