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
import { twMerge } from "tailwind-merge";
import ScrollHideShowComponent from "@/components/ui/ScrollComponent";
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
      href: "/hashtags",
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
    <ScrollHideShowComponent
      target={{
        className:
          "space-y-2 transition-all min-w-full sticky bottom-2 flex items-end justify-start flex-col px-4  text-[19px] text-[#D9D9D9] pb-5 max-h-screen h-full overflow-auto overflow-x-hidden pb-5",
        inVisibleClassname: "translate-y-0 top-2",
        visibleClassname: "translate-y-0 top-2",
      }}
      className={twMerge(
        "hidden lg:block lg:col-span-3 h-full items-start justify-end "
      )}
      targetElement={
        <div className="xl:max-w-[60%] flex flex-col items-start justify-end w-full" >
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
      }
    />
  );
};

export default SideBar;
