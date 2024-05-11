import { isEmpty } from "lodash";
import React, { ReactNode, useMemo } from "react";
import HashtagCard from "../cards/HashtagCard";
import Link from "next/link";
import useCountry from "@/hooks/useCountry";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Each from "../shared/Each";
import HashtagSkeletonCard from "../SkeletonCards/HashtagSkeletonCard";
import useTrendHashtags from "@/hooks/useTrendHashtags";
import EmptyMessage from "../shared/EmptyMessage";

const TrendHashtags = ({
  userLocation,
  MainPage = false,
}: {
  MainPage?: boolean;
  userLocation?: string | null;
}) => {
  const { hashtags, isLoading } = useTrendHashtags();
  const { getByValue } = useCountry();
  const location = useMemo(() => {
    if (userLocation) {
      const currentLocation = getByValue(userLocation);
      return `${currentLocation?.label}, ${currentLocation?.city}`;
    }
    return null;
  }, [userLocation]);
  const Content: ReactNode = useMemo(() => {
    if (!isLoading && isEmpty(hashtags)) {
      return (
        <EmptyMessage type="hashtag">there is no trend hashtags!</EmptyMessage>
      );
    }
    if (isLoading && isEmpty(hashtags)) {
      return (
        <div className="min-w-full flex flex-col items-start justify-start gap-0 border-t-[1px] border-neutral-300 dark:border-neutral-800">
          <Each
            of={[1, 2, 3, 4, 5]}
            render={(_item, index) => (
              <HashtagSkeletonCard key={index} main hideLocation />
            )}
          />
        </div>
      );
    }
    return (
      <div className="min-w-full flex flex-col items-start justify-start ">
        {hashtags.map((h, i) => (
          <HashtagCard
            i={i + 1}
            main={MainPage}
            hideLocation
            hashtag={h}
            key={h.id}
          />
        ))}
      </div>
    );
  }, [hashtags, isLoading]);
  return (
    <motion.div
      initial={{
        translateY: 100,
        opacity: 0,
      }}
      animate={{
        translateY: 0,
        opacity: 100,
      }}
      className={twMerge(
        "min-w-full flex flex-col items-start justify-start gap-3",
        !MainPage
          ? "rounded-xl bg-transparent dark:bg-[#16181C] p-4 border-[1px] dark:border-[#16181C] border-neutral-300 "
          : "rounded-none  bg-light dark:bg-black "
      )}
    >
      <h2
        className={twMerge(
          "min-w-full text-left text-[20px] capitalize font-[800] leading-6 text-text-primary dark:text-[#e7e9ea]",
          MainPage ? "px-3 pt-4" : ""
        )}
      >
        {location} trends
      </h2>
      {Content}
      {!MainPage && (
        <Link
          href={"/hashtags"}
          className="text-sky-500 text-[15px] font-bold hover:text-opacity-60"
        >
          show more
        </Link>
      )}
    </motion.div>
  );
};

export default TrendHashtags;
