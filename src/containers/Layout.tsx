import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import FollowBar from "./FollowBar";
import BottomBar from "./BottomBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen bg-black ">
      <div
        className="container h-full max-xl: xl:px-30
     max-w-full "
      >
        <div className="grid grid-cols-4 h-full relative z-10">
          <SideBar />
          <div className="col-span-4 pb-[70px] sm:pb-[100px] lg:pb-0 lg:col-span-3 xl:col-span-2 border-x-[1px] border-neutral-800">
            {children}
          </div>
          <FollowBar />
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default Layout;
