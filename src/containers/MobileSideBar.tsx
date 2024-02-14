import SideBarItem from "@/components/Layout-components/SideBarItem";
import SideBarTweetButton from "@/components/Layout-components/SideBarTweetButton";
import SideBarLogo from "@/components/shared/SideBarLogo";
import SmallUserBio from "@/components/shared/SmallUserBio";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSidebar from "@/hooks/useSidebar";
import { debounce } from "lodash";
import { signOut } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { BiLogOut, BiSolidHomeCircle } from "react-icons/bi";
import { HiOutlineHashtag, HiOutlineUser } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiUsersBold } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

const MobileSideBar = () => {
  const { data: currentUser } = useCurrentUser();
  const sidebar = useSidebar();
  const [visible, setVisible] = useState(false);
  const items = [
    {
      icon: BiSolidHomeCircle,
      label: "Home",
      href: "/",
    },
    {
      icon: HiOutlineHashtag,
      label: "explore",
      href: "/hashtags",
    },
    {
      icon: IoMdNotificationsOutline,
      label: "Notifications",
      href: `/notifications/${currentUser?.id}`,
      auth: true,
      alert: currentUser?.hasNotification || false,
    },
    {
      icon: HiOutlineUser,
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      auth: true,
    },
    {
      icon: PiUsersBold,
      label: "users",
      href: `/users`,
    },
  ];
  const onClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      sidebar.onClose();
    }, 150);
  }, [visible, sidebar]);

  useEffect(() => {
    setVisible(sidebar.isOpen);
  }, [sidebar.isOpen]);

  if (!sidebar.isOpen) {
    return null;
  }

  return (
    <div className="min-w-full min-h-screen max-h-screen max-w-full flex items-center justify-center fixed z-30  ">
      <div
        className={twMerge(
          "absolute min-w-full min-h-full bg-black transition-all bg-opacity-40 top-0 left-0 z-10",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={() => {
          onClose();
        }}
      ></div>
      <section
        className={twMerge(
          "absolute left-0 top-0 z-30 h-screen min-w-[60%] max-w-[60%] sm:min-w-[400px] max-h-screen min-h-screen overflow-y-auto lg:hidden  bg-black transition-all  ",
          visible ? "translate-x-[0px]" : "translate-x-[-500px]"
        )}
      >
        <div className="flex flex-col items-end min-w-full   max-w-full px-2  py-5 gap-5">
          <SmallUserBio />
          <hr className="min-w-full min-h-[1px] bg-neutral-800 border-none" />
          <div className=" transition-all min-w-full flex items-start justify-start flex-col text-[19px] text-[#D9D9D9]">
            {items.map((item) => (
              <SideBarItem
                labelClassName="block text-lg ms-2"
                key={item.href}
                item={item as any}
              />
            ))}
            {currentUser && (
              <SideBarItem
                item={{
                  onClick: () => signOut(),
                  icon: BiLogOut,
                  label: "Logout",
                }}
                labelClassName="block text-lg ms-2"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileSideBar;
