import React from "react";
import { twMerge } from "tailwind-merge";

const SmallUserCardSkeleton = ({ main }: { main?: boolean }) => {
  return (
    <div
      className={twMerge(
        "min-w-full flex items-center justify-between gap-2 max-w-full overflow-hidden",
        main
          ? "px-3 border-b-[1px] border-neutral-800 py-2 cursor-pointer hover:bg-neutral-800 hover:bg-opacity-60"
          : "px-0"
      )}
    >
      <div
        className={twMerge(
          "flex flex-row gap-4 cursor-default ",
          main && "w-full md:w-fit"
        )}
      >
        <div className="min-w-[40px] min-h-[40px] rounded-full drop-shadow-2xl skeleton"></div>
        <div
          className={twMerge(
            "flex flex-col items-start justify-start gap-2 ",
            main && " min-w-[calc(100%-56px)] max-w-[calc(100%-56px)]"
          )}
        >
          <div
            className={twMerge(
              "flex min-w-full max-w-full justify-start gap-2",
              main
                ? "flex-wrap items-center justify-between md:justify-start"
                : "flex-col items-start"
            )}
          >
            <p className=" min-w-[50px] min-h-[15px] skeleton rounded-full drop-shadow-2xl font-semibold text-[15px] capitalize line-clamp-1 flex flex-wrap items-center justify-start gap-2"></p>
            <p className="min-w-[40px] min-h-[15px] skeleton rounded-full drop-shadow-2xl text-[15px] text-nowrap line-clamp-1 hidden md:block"></p>
            {main && (
              <span className="min-w-[35px] min-h-[15px] skeleton rounded-full drop-shadow-2xl float-right"></span>
            )}
          </div>
          {main && (
            <p
              className={twMerge(
                " line-clamp-1 min-w-full min-h-[15px] skeleton rounded-full drop-shadow-2xl",
                main ? " " : "hidden"
              )}
            ></p>
          )}
        </div>
      </div>
      {main ? (
        <button className=" min-w-[120px] min-h-[30px] skeleton hidden md:block rounded-full"></button>
      ) : (
        <button className="min-w-10 min-h-10 skeleton rounded-full"></button>
      )}
    </div>
  );
};

export default SmallUserCardSkeleton;
