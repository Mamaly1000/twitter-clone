import { isEmpty } from "lodash";
import React from "react"; 
import HashtagCard from "../cards/HashtagCard";
import HashtagPagination from "../shared/HashtagPagination";
import useHashtags from "@/hooks/useHashtags";
import HashtagSkeletonCard from "../SkeletonCards/HashtagSkeletonCard";
import Each from "../shared/Each";
import EmptyMessage from "../shared/EmptyMessage";

const HashtagsFeed = ({
  title,
  params,
  hideLocation,
  emptyType,
}: {
  emptyType?: "hashtag-search" | "hashtag";
  hideLocation?: boolean;
  params?: {
    search?: string | undefined;
    hashtagId?: string | undefined;
  };
  title: string;
}) => {
  const { isLoading, hashtags } = useHashtags();

  if (isEmpty(hashtags) && !isLoading) {
    return (
      <EmptyMessage type={emptyType as any}>
        there is not hashtags!
      </EmptyMessage>
    );
  }

  if (isEmpty(hashtags) || isLoading) {
    return (
      <div className="min-w-full flex flex-col items-start justify-start gap-0 border-t-[1px] border-neutral-800">
        <Each
          of={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          render={(_item, index) => (
            <HashtagSkeletonCard key={index} hideLocation={hideLocation} main />
          )}
        />
      </div>
    );
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
