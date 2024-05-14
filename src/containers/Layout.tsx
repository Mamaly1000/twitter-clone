import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import FollowBar from "./FollowBar";
import BottomBar from "./BottomBar";
import { twMerge } from "tailwind-merge";
import { inter } from "@/pages/_app";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={twMerge(
        "h-screen bg-light dark:bg-black relative min-h-fit",
        inter.className
      )}
    >
      <div className="container h-full xl:px-30 max-w-full relative min-h-fit">
        <div className="grid grid-cols-12 h-full relative z-10">
          <SideBar />
          <section className="col-span-12 pb-[60px] sm:pb-[70px] lg:pb-0 md:col-span-8 lg:col-span-6 border-x-[1px] border-neutral-300 bg-light dark:bg-black dark:border-neutral-800 relative z-[1]  ">
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
