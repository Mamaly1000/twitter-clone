import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import FollowBar from "./FollowBar";
import BottomBar from "./BottomBar";
import { twMerge } from "tailwind-merge";
import { inter } from "@/pages/_app";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={twMerge("h-screen bg-black relative", inter.className)}>
      <div className="container h-full max-xl: xl:px-30 max-w-full relative">
        <div className="grid grid-cols-12 h-full relative z-10">
          <SideBar />
          <section className="col-span-12 pb-[60px] sm:pb-[70px] lg:pb-0 md:col-span-8 lg:col-span-6 border-x-[1px] border-neutral-800 relative">
            {children}
          </section>
          <FollowBar />
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default Layout;
