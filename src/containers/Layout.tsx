import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import FollowBar from "./FollowBar";
import BottomBar from "./BottomBar";
import { twMerge } from "tailwind-merge";
import { inter } from "@/pages/_app";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={twMerge("h-screen bg-black ", inter.className)}>
      <div
        className="container h-full max-xl: xl:px-30
     max-w-full "
      >
        <div className="grid grid-cols-12 h-full relative z-10">
          <SideBar />
          <div className="col-span-12 pb-[70px] sm:pb-[100px] lg:pb-0 lg:col-span-9 xl:col-span-7 border-x-[1px] border-neutral-800">
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
