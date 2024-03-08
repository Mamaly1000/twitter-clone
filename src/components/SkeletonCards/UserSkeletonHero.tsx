import React from "react";

const UserSkeletonHero = () => {
  return (
    <div>
      <div className="skeleton h-44 relative">
        <div className="absolute -bottom-16 left-4">
          <div className="border-[3px] min-w-[128px] min-h-[128px] rounded-full drop-shadow-2xl  border-black skeleton "></div>
        </div>
      </div>
    </div>
  );
};

export default UserSkeletonHero;
