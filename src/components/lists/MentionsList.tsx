import useUsers from "@/hooks/useUsers";
import { User } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

const MentionsList = ({
  mentions,
  onChange,
}: {
  onAdd?: (val: string) => void;
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
  const { users } = useUsers({ type: "mentions" });
  const [usersByIds, setUsersByIds] = useState<Array<undefined | User | null>>(
    []
  );
  const mentionDebounce = debounce(() => {
    if (users && mentions.length > 0) {
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
      setUsersByIds(foundedUsersByIds.filter((i) => !!i));
      onChange(validMentionIds);
    }
  }, 3000);
  useMemo(() => {
    mentionDebounce();
  }, [mentions, users, mentionDebounce]);

  useEffect(() => {
    if (mentions.length === 0) {
      setUsersByIds([]);
      onChange([]);
    }
  }, [mentions]);

  return (
    mentions.length > 0 && (
      <div className="min-w-fit max-w-full border-[2px] border-neutral-300 dark:border-neutral-800 rounded-lg px-3 py-2 overflow-hidden flex flex-wrap items-center justify-center gap-3 capitalize">
        <div className="min-w-fit flex items-start justify-start flex-wrap gap-2 text-[12px] text-neutral-500 dark:text-neutral-300">
          tagged
          {usersByIds[0] && (
            <span className="text-[12px] text-sky-500">
              {usersByIds[0]?.username}
            </span>
          )}
          {usersByIds.length > 1 && ` and ${usersByIds.length - 1} more...`}
        </div>
      </div>
    )
  );
};

export default MentionsList;
