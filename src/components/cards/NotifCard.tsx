import useUserByUsername from "@/hooks/useUserByUsername";
import { Notification } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Avatar from "../shared/Avatar";

const NotifCard = ({ notif }: { notif: Notification }) => {
  const username = notif.body
    .split(" ")
    .find((word) => word.includes("@"))
    ?.split("@")[1];

  const { user } = useUserByUsername(username);
  const router = useRouter();
  const createdAt = useMemo(() => {
    if (!notif?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(notif.createdAt));
  }, [notif.createdAt]);
  return (
    <div
      onClick={() => router.push(`/users/${user?.id}`)}
      key={notif.id}
      className="flex flex-row items-center justify-between p-6 gap-4 border-b-[1px] border-neutral-800 min-w-full cursor-pointer hover:opacity-80 transition-all"
    >
      <div className="flex items-center flex-col sm:flex-row justify-start gap-3">
        <Avatar userId={user?.id} />
        <p className="text-white">
          <span className="text-sky-300 font-bold">
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
