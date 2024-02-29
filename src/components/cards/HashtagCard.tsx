import useCountry from "@/hooks/useCountry";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import {
  formatNumbersWithCommas,
  getStringDirectionality,
} from "@/libs/wordDetector";
import { Hashtag } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";

const HashtagCard = ({
  hashtag,
  main = false,
  hideLocation = false,
  i,
}: {
  i?: number;
  main?: boolean;
  hashtag: Hashtag;
  hideLocation?: boolean;
}) => {
  const router = useRouter();

  const { getByValue } = useCountry();
  const { data: user } = useCurrentUser();

  const loginModal = useLoginModal();

  const location = useMemo(() => {
    if (hashtag.location) {
      const currentLocation = getByValue(hashtag.location);
      return `${currentLocation?.label}, ${currentLocation?.region}, ${currentLocation?.city}`;
    }
    return null;
  }, [hashtag.location]);
 

  const onClick = useCallback(() => {
    if (!user) {
      loginModal.onOpen();
    }
    router.push(`/hashtags/${hashtag.id}`);
  }, [loginModal, user, hashtag.id, router]);

  const direction = useMemo(() => {
    return getStringDirectionality(hashtag.name);
  }, [hashtag.name]);

  return (
    <div
      onClick={onClick}
      className={twMerge(
        "min-w-full py-2 flex flex-col items-start justify-start gap-1  min-h-fit cursor-pointer hover:opacity-60",
        main && "px-3  border-b-[1px] border-neutral-800"
      )}
    >
      {location && !hideLocation && (
        <p className="text-[13px] text-[#6E767D] capitalize">
          {i} · trending in {location}
        </p>
      )}
      <span
        className={twMerge(
          "font-semibold capitalize text-[15px] leading-5 text-gray-900 dark:text-white",
          direction.className
        )}
      >
        #{hashtag.name}
      </span>
      <p className="text-[13px] text-[#6E767D] capitalize flex items-center justify-start gap-2">
        {!!main &&
          formatNumbersWithCommas(`${hashtag.userIds.length} users`) + " - "}
        {formatNumbersWithCommas(`${hashtag.postIds.length} tweets`)}
      </p>
    </div>
  );
};

export default HashtagCard;
