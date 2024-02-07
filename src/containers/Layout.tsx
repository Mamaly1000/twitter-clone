import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import FollowBar from "./FollowBar";
import BottomBar from "./BottomBar";
import { twMerge } from "tailwind-merge";
import { inter } from "@/pages/_app";
import ScrollHideShowComponent from "@/components/ui/ScrollComponent";
import SideBarTweetButton from "@/components/Layout-components/SideBarTweetButton";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={twMerge("h-screen bg-black ", inter.className)}>
      <div
        className="container h-full max-xl: xl:px-30
     max-w-full "
      >
        <div className="grid grid-cols-12 h-full relative z-10">
          <SideBar />
          <ScrollHideShowComponent
            target={{
              className: "fixed bottom-[65px] sm:bottom-[75] end-2 lg:hidden",
            }}
            targetElement={
              <SideBarTweetButton className="m-0 w-[45px] h-[45px] p-2 lg:hidden" />
            }
            className="col-span-12   pb-[65px] sm:pb-[75px] lg:pb-0 lg:col-span-9 xl:col-span-7 border-x-[1px] border-neutral-800 relative"
          >
            {children}
          </ScrollHideShowComponent>
          <FollowBar />
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default Layout;
