"use client";
import SideBarItem from "@/components/Layout-components/SideBarItem";
import SmallUserBio from "@/components/shared/SmallUserBio";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSidebar from "@/hooks/useSidebar";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { HiOutlineHashtag, HiOutlineUser } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiUsersBold } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

const MobileSideBar = () => {
  const { data: currentUser } = useCurrentUser();
  const sidebar = useSidebar();
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const items = [
    {
      icon: GoHome,
      label: "Home",
      href: "/",
      isActive: pathname === "/",
    },
    {
      icon: HiOutlineHashtag,
      label: "explore",
      href: "/hashtags",
      isActive: pathname?.endsWith("hashtags"),
    },
    {
      icon: IoMdNotificationsOutline,
      label: "Notifications",
      href: `/notifications/${currentUser?.id}`,
      auth: true,
      alert: currentUser?.notificationCount || 0,
      isActive: !!pathname?.match("notifications"),
    },
    {
      icon: HiOutlineUser,
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      auth: true,
      isActive: !!pathname?.endsWith("users/" + currentUser?.id),
    },
    {
      icon: PiUsersBold,
      label: "users",
      href: `/users`,
      isActive: pathname?.endsWith("users"),
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
          "absolute min-w-full min-h-full bg-light dark:bg-black transition-all bg-opacity-40 top-0 left-0 z-10",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={() => {
          onClose();
        }}
      />
      <section
        className={twMerge(
          `absolute left-0 top-0 z-30
           h-screen min-w-[60%] max-w-[60%] sm:min-w-[400px] max-h-screen min-h-screen 
           overflow-y-auto lg:hidden transition-all 
            bg-light dark:bg-black`,
          visible ? "translate-x-[0px]" : "translate-x-[-500px]"
        )}
      >
        <div className="flex flex-col items-end min-w-full   max-w-full px-2  py-5 gap-5">
          <SmallUserBio />
          <hr className="min-w-full min-h-[.5px] bg-neutral-300 dark:bg-neutral-800  border-none" />
          <div className=" transition-all min-w-full flex items-start justify-start flex-col text-[19px]  ">
            {items.map((item) => (
              <SideBarItem
                key={item.href}
                item={item as any}
                iconSize={26}
                mobile
                isActive={item.isActive}
              />
            ))}
            {currentUser && (
              <SideBarItem
                item={{
                  onClick: () => signOut(),
                  icon: BiLogOut,
                  label: "Logout",
                }}
                mobile
                iconSize={26}
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
