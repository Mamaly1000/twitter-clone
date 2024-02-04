import { Hashtag } from "@prisma/client";
import { isEmpty } from "lodash";
import React from "react";
import HashtagCard from "../cards/HashtagCard";
import Link from "next/link";

const TrendHashtags = ({ hashtags }: { hashtags: Hashtag[] }) => {
  if (isEmpty(hashtags)) {
    return null;
  }
  return (
    <div className="bg-[#202327] text-[#D9D9D9] rounded-xl p-4 min-w-full flex flex-col items-start justify-start gap-3">
      <h2 className="text-[20px] font-bold capitalize">trend hashtags</h2>
      <div className="min-w-full flex flex-col items-start justify-start ">
        {hashtags.map((h) => (
          <HashtagCard hashtag={h} key={h.id} />
        ))}
      </div>
      <Link
        href={"/hashtags"}
        className="text-sky-500 text-[15px] font-bold hover:text-opacity-60"
      >
        show more
      </Link>
    </div>
  );
};

export default TrendHashtags;
