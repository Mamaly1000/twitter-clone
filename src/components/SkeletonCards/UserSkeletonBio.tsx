import React from "react";

const UserSkeletonBio = () => {
  return (
    <div className="border-b-[1px] border-neutral-300 dark:border-neutral-800 pb-4">
      <div className="flex justify-end p-2">
        <button className=" min-w-[120px] min-h-[30px] skeleton hidden md:block rounded-full"></button>
      </div>
      <div className="mt-8 px-4">
        <div className="flex flex-col items-start justify-start gap-2">
          <p className="min-w-[100px] min-h-[20px] rounded-full skeleton"></p>
          <p className="min-w-[60px] min-h-[15px] rounded-full skeleton"></p>
        </div>
        <div className="flex flex-col mt-4">
          <p className="min-w-full max-w-full flex flex-col items-start justify-start gap-2">
            <span className="min-w-full min-h-[15px] skeleton rounded-full"></span>
            <span className="min-w-full min-h-[15px] skeleton rounded-full"></span>
            <span className="min-w-[65%] min-h-[15px] skeleton rounded-full"></span>
          </p>
          <div className="w-[80%] mt-5 sm:max-w-[70%] flex flex-wrap items-start justify-start gap-x-3 gap-y-2 text-[12px] md:text-[16px]">
            <span className="skeleton min-w-[45px] min-h-[14px] rounded-full"></span>
            <span className="skeleton min-w-[45px] min-h-[14px] rounded-full"></span>
            <span className="skeleton min-w-[45px] min-h-[14px] rounded-full"></span>
            <span className="skeleton min-w-[45px] min-h-[14px] rounded-full"></span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4 gap-6">
          <div className="min-w-[70px] min-h-[18px] rounded-full skeleton"></div>
          <div className="min-w-[70px] min-h-[18px] rounded-full skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default UserSkeletonBio;
