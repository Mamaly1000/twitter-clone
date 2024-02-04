import useCountry from "@/hooks/useCountry";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { formatNumbersWithCommas } from "@/libs/wordDetector";
import { Hashtag } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";

const HashtagCard = ({ hashtag }: { hashtag: Hashtag }) => {
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
    router.push(`/hashtags/${hashtag.name}`);
  }, [loginModal, user, hashtag.name, router]);

  return (
    <div
      onClick={onClick}
      className="min-w-full py-2 flex-col items-start justify-start gap-3  min-h-fit cursor-pointer hover:opacity-60"
    >
      {location && (
        <p className="text-[13px] text-[#6E767D] capitalize">
          trending in {location}
        </p>
      )}
      <span className="font-semibold uppercase text-lg leading-5 text-gray-900 dark:text-white">
        #{hashtag.name}
      </span>
      <p className="text-[13px] text-[#6E767D] capitalize">
        {formatNumbersWithCommas(`${hashtag.postIds.length} tweets`)}
      </p>
    </div>
  );
};

export default HashtagCard;
