import { Hashtag } from "@prisma/client";
import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import HashtagCard from "../cards/HashtagCard";
import Link from "next/link";
import useCountry from "@/hooks/useCountry";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const TrendHashtags = ({
  hashtags,
  userLocation,
  MainPage = false,
}: {
  MainPage?: boolean;
  userLocation?: string | null;
  hashtags: Hashtag[];
}) => {
  const { getByValue } = useCountry();
  const location = useMemo(() => {
    if (userLocation) {
      const currentLocation = getByValue(userLocation);
      return `${currentLocation?.label}, ${currentLocation?.city}`;
    }
    return null;
  }, [userLocation]);
  if (isEmpty(hashtags)) {
    return null;
  }
  return (
    <motion.div
      initial={{
        translateX: 100,
        opacity: 0,
      }}
      animate={{
        translateX: 0,
        opacity: 100,
      }}
      className={twMerge(
        " text-[#D9D9D9]   min-w-full flex flex-col items-start justify-start gap-3",
        !MainPage ? "rounded-xl bg-[#16181C] p-4" : "rounded-none bg-black "
      )}
    >
      <h2
        className={twMerge(
          "min-w-full text-left text-[20px] capitalize font-[800] leading-6 text-[#e7e9ea]",
          MainPage ? "px-3 pt-4" : ""
        )}
      >
        {location} trends
      </h2>
      <div className="min-w-full flex flex-col items-start justify-start ">
        {hashtags.map((h, i) => (
          <HashtagCard i={i + 1} main hideLocation hashtag={h} key={h.id} />
        ))}
      </div>
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
