import SideBarItem from "@/components/Layout-components/SideBarItem";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePathname } from "next/navigation";
import React from "react";
import { HiOutlineHashtag } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiUsersBold } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import SideBarTweetButton from "@/components/Layout-components/SideBarTweetButton";
import { GoHome } from "react-icons/go";

const BottomBar = () => {
  const { data: currentUser } = useCurrentUser();
  const { isScrolling } = useScrollAnimation({});
  const pathname = usePathname();
  const items = [
    {
      icon: GoHome,
      label: "Home",
      href: "/",
      isActive: pathname === "/",
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
      icon: PiUsersBold,
      label: "users",
      href: `/users`,
      isActive: pathname?.endsWith("users"),
    },
    {
      icon: HiOutlineHashtag,
      label: "explore",
      href: "/hashtags",
      isActive: pathname?.endsWith("hashtags"),
    },
  ];
  return (
    <motion.section
      className={twMerge(
        "fixed flex md:hidden items-center justify-between gap-1 px-2 min-w-full z-20 min-h-[60px] max-h-[60px] border-t-[1px] dark:border-neutral-800 border-neutral-300 sm:min-h-[70px]  bg-light dark:bg-black sm:max-h-[70px] bottom-0 left-0 transition-all backdrop-blur-2xl"
      )}
      animate={{ opacity: isScrolling ? 0.5 : 1 }}
    >
      {items.map((item) => (
        <SideBarItem
          key={item.href}
          item={item as any}
          bottomBar
          isActive={item.isActive}
        />
      ))}
      <SideBarTweetButton className="absolute top-[-60px] right-2 m-0 w-[45px] h-[45px] p-2 " />
    </motion.section>
  );
};

export default BottomBar;
