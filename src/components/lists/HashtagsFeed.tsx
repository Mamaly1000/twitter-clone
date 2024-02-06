import { Hashtag } from "@prisma/client";
import { isEmpty } from "lodash";
import React from "react";
import Loader from "../shared/Loader";
import HashtagCard from "../cards/HashtagCard";

const HashtagsFeed = ({
  hashtags,
  title,
}: {
  hashtags: Hashtag[];
  title: string;
}) => {
  if (isEmpty(hashtags)) {
    return <Loader message="please wait" />;
  }

  return (
    <section className="min-w-full max-w-full flex flex-col items-start text-[#d9d9d9] justify-start gap-3 py-4">
      <h2 className="min-w-full text-left text-[20px] capitalize px-3 font-bold">
        {title}
      </h2>
      <div className="min-w-full flex flex-col items-start justify-start gap-0 border-t-[1px] border-neutral-800">
        {hashtags.map((h) => (
          <HashtagCard main hashtag={h} key={h.id} />
        ))}
      </div>
    </section>
  );
};

export default HashtagsFeed;
