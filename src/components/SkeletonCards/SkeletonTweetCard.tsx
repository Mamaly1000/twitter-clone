import React from "react";
import SkeletonActionsBar from "./SkeletonActionsBar";
import { twMerge } from "tailwind-merge";
import MediaSkeletonCard from "./MediaSkeletonCard";

const SkeletonTweetCard = ({ isComment }: { isComment?: boolean }) => {
  return (
    <article
      className={twMerge(
        "min-w-full max-w-full border-b-[1px] border-neutral-300 dark:border-neutral-800  cursor-pointer  transition-all group flex items-center justify-center flex-col p-0 relative ",
        isComment && "overflow-hidden"
      )}
    >
      <div
        className={twMerge(
          "flex flex-col pb-0 items-start justify-start min-w-full max-w-full dark:hover:bg-neutral-900/50 hover:bg-neutral-100/50",
          isComment ? "px-5 pt-5 gap-4" : "p-2"
        )}
      >
        {/* main tweet container */}
        <div
          className={twMerge(
            "min-w-full max-w-full flex items-start justify-start gap-3",
            isComment ? "flex-col" : "flex-row"
          )}
        >
          {/* tweet avatar section */}
          <div
            className={twMerge(
              "flex relative z-10",
              isComment
                ? "flex-row items-start justify-start gap-4"
                : "flex-col items-center justify-center gap-1"
            )}
          >
            <div className=" relative z-[1] flex items-center justify-center">
              <div
                className={twMerge(
                  "min-w-[40px] min-h-[40px] rounded-full skeleton relative"
                )}
              ></div>
            </div>
            {!!isComment && (
              <div className="flex flex-wrap text-[15px] items-center gap-[6px] line-clamp-1 min-w-full max-w-full">
                <p className="min-w-[100px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></p>
                <span className="min-w-[55px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
                {!!!isComment && (
                  <span className="min-w-[45px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
                )}
              </div>
            )}
          </div>
          {/* main tweet content section */}
          <div
            className={twMerge(
              "max-h-fit relative z-0 flex flex-col items-start justify-start gap-2",
              isComment
                ? "w-full max-w-full "
                : " min-w-[calc(100%-52px)] max-w-[calc(100%-52px)]"
            )}
          >
            {!!!isComment && (
              <div className="flex flex-wrap text-[15px] items-center gap-[6px] line-clamp-1 min-w-full max-w-full">
                <p className="min-w-[100px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></p>
                <span className="min-w-[55px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
                {!!!isComment && (
                  <span className="min-w-[45px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
                )}
              </div>
            )}
            {/* tweet body and repost section */}
            <div
              className={twMerge(
                "text-[#D9D9D9] flex flex-col items-start justify-start gap-3 min-w-full max-w-full",
                isComment ? "mt-4 mb-3" : "mt-1"
              )}
            >
              <p className="min-w-full max-w-full flex flex-col items-start justify-start gap-2">
                <span className="min-w-[70%] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
                <span className="min-w-[70%] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
                <span className="min-w-[45%] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
              </p>
              <MediaSkeletonCard />
              {/* repost-container */}
              {isComment && (
                <span className="min-w-[40px] min-h-[15px] rounded-full skeleton drop-shadow-2xl"></span>
              )}
            </div>
            {isComment && (
              <div className="min-w-full flex items-center justify-start gap-2 text-sm capitalize border-t-[1px] border-t-neutral-300 dark:border-t-neutral-800 py-3">
                <span className="min-w-[60px] min-h-[20px] rounded-full drop-shadow-2xl skeleton"></span>
                <span className="min-w-[60px] min-h-[20px] rounded-full drop-shadow-2xl skeleton"></span>
              </div>
            )}
            {isComment && (
              <div className="min-w-full flex items-center justify-start gap-2 text-sm capitalize border-t-[1px] border-t-neutral-300 dark:border-t-neutral-800 py-3">
                <span className="min-w-[60px] min-h-[20px] rounded-full drop-shadow-2xl skeleton"></span>
                <span className="min-w-[60px] min-h-[20px] rounded-full drop-shadow-2xl skeleton"></span>
              </div>
            )}
            <SkeletonActionsBar isComment={isComment} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default SkeletonTweetCard;
