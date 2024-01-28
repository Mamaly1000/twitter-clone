import useUsers from "@/hooks/useUsers";
import { User } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import Avatar from "../shared/Avatar";
import { twMerge } from "tailwind-merge";

const MentionsList = ({
  mentions,
  onChange,
}: {
  mentions: {
    id: string | undefined;
    username: String;
  }[];
  onChange: (
    val: {
      id: string;
      username: String;
    }[]
  ) => void;
}) => {
  const { users } = useUsers();
  const [usersByIds, setUsersByIds] = useState<Array<undefined | User | null>>(
    []
  );

  useMemo(() => {
    if (users) {
      const mentionsIds = mentions.map((mention) => ({
        id: users.find((user) =>
          user!.username
            ? user!.username.toLowerCase() === mention.username.toLowerCase()
            : null
        )?.id,
        username: mention.username,
      }));
      const foundedUsersByIds = mentionsIds.map((m) =>
        users.find((user) => m.id === user.id)
      );
      const validMentionIds = mentionsIds.filter((m) => m.id !== undefined) as {
        id: string;
        username: String;
      }[];
      setUsersByIds(foundedUsersByIds);
      onChange(validMentionIds);
    }
  }, [mentions, users]);

  return (
    <div className="min-w-full flex flex-col items-center justify-start gap-3 capitalize">
      <div className="min-w-full flex flex-row items-center justify-start gap-3 capitalize">
        <h4 className="capitalize w-fit text-sm whitespace-nowrap font-semibold">
          mentions :
        </h4>
        <div className="min-w-full flex items-start justify-start flex-wrap gap-2">
          {mentions.map((m) => (
            <span
              key={m.id}
              className={twMerge(
                "px-3 py-2 rounded-md drop-shadow-2xl border-[1px]  text-sm font-semibold capitalize",
                !!!usersByIds.find(
                  (user) =>
                    !!user &&
                    user?.username?.toLowerCase() === m.username.toLowerCase()
                )?.id
                  ? "border-red-400 text-red-400"
                  : "border-sky-400 text-sky-400"
              )}
            >
              @{m.username}
            </span>
          ))}
        </div>{" "}
      </div>
      <div className="min-w-full flex flex-row items-center justify-start gap-3 capitalize">
        <h4 className="capitalize w-fit text-sm whitespace-nowrap font-semibold">
          valid mentions :
        </h4>
        <div className="min-w-full flex items-start justify-start flex-wrap gap-2">
          {usersByIds.map(
            (user) =>
              !!user && (
                <div
                  key={user!.id}
                  className={twMerge(
                    "px-3 py-2 rounded-md drop-shadow-2xl text-sm font-semibold capitalize flex items-center justify-center gap-2"
                  )}
                >
                  <Avatar
                    className="border-[1px] border-sky-400 text-sky-400"
                    userId={user!.id}
                  />
                  <p className="capitalize text-[15px] text-white flex flex-col items-start justify-start">
                    {user!.name}
                    <span className="text-[12px] text-neutral-300">
                      @{user!.username}
                    </span>
                  </p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default MentionsList;
