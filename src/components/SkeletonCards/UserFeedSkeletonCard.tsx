import React, { FC } from "react";

const UserFeedSkeletonCard: FC<{ main?: boolean }> = () => {
  return (
    <article className="min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px] rounded-lg drop-shadow-2xl p-0 relative border-[1px] border-neutral-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-900/50 hover:bg-neutral-100/50">
      <div className="aspect-video min-w-full max-w-full overflow-hidden rounded-t-lg min-h-[130px] max-h-[130px] relative skeleton"></div>
      <div className=" min-w-full max-w-full relative flex flex-col items-start justify-start gap-3 z-10 py-3 min-h-[170px]">
        <div className="min-w-full max-w-full flex items-center justify-end gap-2 px-3  relative">
          <div className="absolute min-w-[70px] min-h-[70px] top-[-45px] left-3 skeleton drop-shadow-2xl rounded-full"></div>
          <button className=" min-w-[120px] min-h-[30px] skeleton hidden md:block rounded-full"></button>
        </div>
        <div className="min-w-full flex flex-col items-start justify-start px-3 gap-2">
          <p className="min-w-[100px] min-h-[25px] rounded-full skeleton"></p>
          <p className="min-w-[45px] min-h-[15px] rounded-full skeleton"></p>
        </div>
        <p className="min-w-full absolute bottom-3 left-0 max-w-full overflow-hidden px-3 flex flex-col items-start justify-start gap-2">
          <span className="min-w-full min-h-[15px] skeleton rounded-full"></span>
          <span className="min-w-[80%] min-h-[15px] skeleton rounded-full"></span>
        </p>
      </div>
    </article>
  );
};

export default UserFeedSkeletonCard;
