import SideBarItem from "@/components/Layout-components/SideBarItem";
import SideBarTweetButton from "@/components/Layout-components/SideBarTweetButton";
import SideBarLogo from "@/components/shared/SideBarLogo";
import useCurrentUser from "@/hooks/useCurrentUser";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import React from "react";
import { BiLogOut } from "react-icons/bi";
import { BsBellFill, BsHouseFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

const BottomBar = () => {
  const { data: currentUser } = useCurrentUser();
  const items = [
    {
      icon: BsHouseFill,
      label: "Home",
      href: "/",
    },
    {
      icon: BsBellFill,
      label: "Notifications",
      href: `/notifications/${currentUser?.id}`,
      auth: true,
      alert: (currentUser as User)?.hasNotification || false,
    },
    {
      icon: FaUser,
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      auth: true,
    },
  ];
  return (
    <section className="fixed flex items-center justify-between gap-1 px-2 min-w-full z-20 bg-black bg-opacity-30 backdrop-blur-sm min-h-[70px] max-h-[70px] sm:min-h-[100px] sm:max-h-[100px] bottom-0 left-0 ">
      <SideBarLogo />
      {items.map((item) => (
        <SideBarItem labelClassName="hidden sm:text-[10px] sm:block" key={item.href} item={item as any} />
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
      <SideBarTweetButton className="m-0" />
    </section>
  );
};

export default BottomBar;
