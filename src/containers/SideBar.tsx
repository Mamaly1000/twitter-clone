import SideBarItem from "@/components/Layout-components/SideBarItem";
import SideBarLogo from "@/components/shared/SideBarLogo";
import React from "react";
import { BiLogOut, BiSolidHomeCircle } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import SideBarTweetButton from "@/components/Layout-components/SideBarTweetButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { signOut } from "next-auth/react";
import { HiOutlineHashtag, HiOutlineUser } from "react-icons/hi";
import { PiUsersBold } from "react-icons/pi";
import { User } from "@prisma/client";
const SideBar = () => {
  const { data: currentUser } = useCurrentUser();
  const items = [
    {
      icon: BiSolidHomeCircle,
      label: "Home",
      href: "/",
    },
    {
      icon: HiOutlineHashtag,
      label: "explore",
      href: "/explore",
    },
    {
      icon: IoMdNotificationsOutline,
      label: "Notifications",
      href: `/notifications/${currentUser?.id}`,
      auth: true,
      alert: (currentUser as User)?.hasNotification || false,
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
  return (
    <section className="hidden lg:block  lg:col-span-3 xl:col-span-2 h-full  ">
      <div className="flex flex-col items-end min-w-full   ">
        <div className="space-y-2   transition-all min-w-full flex items-start justify-start flex-col px-4  text-[19px] text-[#D9D9D9]">
          <SideBarLogo />
          {items.map((item) => (
            <SideBarItem key={item.href} item={item as any} />
          ))}
          {currentUser && (
            <SideBarItem
              item={{
                onClick: () => signOut(),
                icon: BiLogOut,
                label: "Logout",
              }}
            />
          )}
          <SideBarTweetButton className="lg:min-w-full text-[17px]" />
        </div>
      </div>
    </section>
  );
};

export default SideBar;
