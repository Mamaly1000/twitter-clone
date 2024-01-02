import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import FollowBar from "./FollowBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen bg-black ">
      <div
        className="container h-full max-xl: xl:px-30
     max-w-full "
      >
        <div className="grid grid-cols-4 h-full">
          <SideBar />
          <div className="col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800">
            {children}
          </div>
          <FollowBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
