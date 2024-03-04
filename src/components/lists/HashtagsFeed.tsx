import { isEmpty } from "lodash";
import React from "react";
import Loader from "../shared/Loader";
import HashtagCard from "../cards/HashtagCard";
import HashtagPagination from "../shared/HashtagPagination";
import useHashtags from "@/hooks/useHashtags";

const HashtagsFeed = ({
  title,
  params,
  hideLocation,
}: {
  hideLocation?: boolean;
  params?: {
    search?: string | undefined;
    hashtagId?: string | undefined;
  };
  title: string;
}) => {
  const { isLoading, hashtags } = useHashtags();

  if (isEmpty(hashtags) || isLoading) {
    return <Loader message="please wait" />;
  }

  return (
    <section className="min-w-full max-w-full flex flex-col items-start text-[#d9d9d9] justify-start gap-3 py-4">
      <h2 className="min-w-full text-left text-[20px] capitalize px-3 font-[800] leading-6 text-[#e7e9ea]">
        {title}
      </h2>
      <div className="min-w-full flex flex-col items-start justify-start gap-0 border-t-[1px] border-neutral-800">
        {hashtags.map((h, i) => (
          <HashtagCard
            main
            i={i + 1}
            hideLocation={hideLocation}
            hashtag={h}
            key={h.id + i}
          />
        ))}
      </div>
      <HashtagPagination params={params} />
    </section>
  );
};

export default HashtagsFeed;
