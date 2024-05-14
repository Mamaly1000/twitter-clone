import SideBarItem from "@/components/Layout-components/SideBarItem";
import SideBarLogo from "@/components/shared/SideBarLogo";
import React from "react";
import { BiLogOut } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import SideBarTweetButton from "@/components/Layout-components/SideBarTweetButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { signOut } from "next-auth/react";
import { HiOutlineHashtag, HiOutlineUser } from "react-icons/hi";
import { PiUsersBold } from "react-icons/pi";
import { User } from "@prisma/client";
import { GoHome } from "react-icons/go";
import { twMerge } from "tailwind-merge";
import ScrollHideShowComponent from "@/components/ui/ScrollComponent";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/inputs/ToggleTheme";
const SideBar = () => {
  const { data: currentUser } = useCurrentUser();
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
  return (
    <ScrollHideShowComponent
      target={{
        className:
          "space-y-2  z-10 transition-all min-w-full sticky bottom-2 flex items-end justify-start flex-col px-4  text-[19px] pb-5 max-h-screen h-full overflow-auto pb-5",
        inVisibleClassname: "translate-y-0 top-2",
        visibleClassname: "translate-y-0 top-2",
      }}
      className={twMerge(
        "hidden md:block bg-light dark:bg-black md:col-span-3 h-full relative z-10 items-start justify-end "
      )}
      targetElement={
        <div className="min-w-fit md:max-w-[60px] lg:max-w-[85%] xl:max-w-[60%] flex flex-col items-start justify-end w-full  relative z-10 bg-light dark:bg-black">
          <SideBarLogo />
          {items.map((item) => (
            <SideBarItem
              key={item.href}
              isActive={item.isActive}
              item={item as any}
              iconSize={26}
            />
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
      }
    />
  );
};

export default SideBar;
