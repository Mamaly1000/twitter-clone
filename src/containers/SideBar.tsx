import SideBarItem from "@/components/Layout-components/SideBarItem";
import SideBarLogo from "@/components/shared/SideBarLogo";
import React from "react";
import { BsBellFill, BsHouseFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import SideBarTweetButton from "@/components/Layout-components/SideBarTweetButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";
const SideBar = () => {
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
    <section className="col-span-1 h-full pr-4 md:pr-6">
      <div className="flex flex-col items-end ">
        <div className="spay2 *: lg:w-[230px] ">
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
          <SideBarTweetButton />
        </div>
      </div>
    </section>
  );
};

export default SideBar;
