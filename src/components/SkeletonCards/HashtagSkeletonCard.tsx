import React from "react";
import { twMerge } from "tailwind-merge";

const HashtagSkeletonCard = ({
  hideLocation,
  main,
}: {
  main?: boolean;
  hideLocation?: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "min-w-full max-w-full py-2 flex flex-col items-start justify-start gap-1  min-h-fit cursor-pointer hover:opacity-60",
        main && "px-3  border-b-[1px] border-neutral-300 dark:border-neutral-800"
      )}
    >
      {!hideLocation && (
        <p className="min-w-[200px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></p>
      )}
      <span className="min-w-[130px] min-h-[30px] rounded-full skeleton drop-shadow-2xl"></span>
      <p className="min-w-full flex items-center justify-start gap-2">
        <span className="min-w-[50px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
        <span className="min-w-[50px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
      </p>
    </div>
  );
};

export default HashtagSkeletonCard;
