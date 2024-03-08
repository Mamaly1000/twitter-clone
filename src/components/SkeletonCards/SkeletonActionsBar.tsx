import React from "react";
import { twMerge } from "tailwind-merge";

const SkeletonActionsBar = ({
  large,
  isComment,
  className,
}: {
  className?: string;
  isComment?: boolean;
  large?: boolean;
}) => {
  return large ? (
    <section className={className}>
      <div className="min-w-[50px] min-h-[50px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[50px] min-h-[50px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[50px] min-h-[50px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[50px] min-h-[50px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[50px] min-h-[50px] rounded-lg skeleton drop-shadow-2xl"></div>
    </section>
  ) : (
    <section
      className={twMerge(
        "flex flex-row items-center text-[15px] gap-5 sm:gap-10 text-[#728291] min-w-full max-w-full",
        isComment
          ? "min-w-full justify-evenly py-3 border-t-[1px] border-t-neutral-800"
          : "justify-between md:justify-normal"
      )}
    >
      <div className="min-w-[25px] min-h-[25px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[25px] min-h-[25px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[25px] min-h-[25px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[25px] min-h-[25px] rounded-lg skeleton drop-shadow-2xl"></div>
      <div className="min-w-[25px] min-h-[25px] rounded-lg skeleton drop-shadow-2xl"></div>
    </section>
  );
};

export default SkeletonActionsBar;
