import React from "react";
import { twMerge } from "tailwind-merge";
import { BiDotsVertical } from "react-icons/bi";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import SkeletonActionsBar from "./SkeletonActionsBar";
import MediaSkeletonCard from "./MediaSkeletonCard";

const CommentSkeletonCard = ({
  i,
  lastIndex,
}: {
  i: number;
  lastIndex: number;
}) => {
  const [ref, { height }] = useMeasure();
  return (
    <div
      className={twMerge(
        `min-w-full px-5  cursor-pointer dark:hover:bg-neutral-900/50 hover:bg-neutral-100/50 transition-all max-w-full`,
        i === 0 ? "pt-4 pb-1" : "py-1",
        lastIndex === i && "pb-3"
      )}
    >
      <div className="flex flex-row items-start gap-3">
        <div className="w-fit flex items-center justify-start flex-col relative ">
          <div className="min-w-[40px] min-h-[40px] rounded-full drop-shadow-2xl skeleton relative z-[2]"></div>
          <div className="absolute flex flex-col items-center justify-center gap-1 z-[1]">
            <motion.hr
              className="w-[1.8px] rounded-md bg-neutral-300 bg-opacity-30 border-none transition-all  z-10"
              animate={{ height: lastIndex === i ? height - 20 : height }}
            />
            {lastIndex === i && (
              <span className="flex flex-col text-neutral-300 text-opacity-50 text-lg gap-1 ">
                <BiDotsVertical />
              </span>
            )}
          </div>
        </div>
        <div
          ref={ref}
          className="min-w-[calc(100%-52px)] max-w-[calc(100%-52px)] flex flex-col items-start justify-start gap-2 max-h-fit"
        >
          <div className="flex flex-col  items-start gap-2 justify-start min-w-full max-w-full">
            <div className="  flex  items-center justify-start gap-1 min-w-full max-w-full">
              <p className="min-w-[100px] min-h-[20px] rounded-full skeleton"></p>
              <span className="min-w-[70px] min-h-[20px] rounded-full skeleton"></span>
              <span className="min-w-[40px] min-h-[20px] rounded-full skeleton"></span>
            </div>
            <p className="min-w-[130px] min-h-[20px] rounded-full skeleton"></p>
          </div>
          <p
            className={twMerge(
              "min-w-full max-h-full flex flex-col items-start justify-start gap-2"
            )}
          >
            <span className="min-w-full min-h-[15px] rounded-full skeleton"></span>
            <span className="min-w-full min-h-[15px] rounded-full skeleton"></span>
            <span className="min-w-[60%] min-h-[15px] rounded-full skeleton"></span>
          </p>
          <MediaSkeletonCard />
          <SkeletonActionsBar />
        </div>
      </div>
    </div>
  );
};

export default CommentSkeletonCard;
