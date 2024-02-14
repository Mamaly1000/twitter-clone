import SideBarItem from "@/components/Layout-components/SideBarItem";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import useSidebar from "@/hooks/useSidebar";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import React from "react";
import { BiSolidHomeCircle } from "react-icons/bi";
import { HiOutlineHashtag, HiOutlineUser } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiUsersBold } from "react-icons/pi";

const BottomBar = () => {
  const { data: currentUser } = useCurrentUser();
  const pathname = usePathname();
  const sidebar = useSidebar();
  const loginModal = useLoginModal();
  const items = [
    {
      icon: BiSolidHomeCircle,
      label: "Home",
      href: "/",
      isActive: pathname === "/",
    },
    {
      icon: IoMdNotificationsOutline,
      label: "Notifications",
      href: `/notifications/${currentUser?.id}`,
      auth: true,
      alert: (currentUser as User)?.hasNotification || false,
      isActive: pathname?.includes("notifications"),
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
    <section className="fixed flex lg:hidden items-center justify-between gap-1 px-2 min-w-full z-20 min-h-[60px] max-h-[60px] border-t-[1px] border-neutral-800 sm:min-h-[70px] bg-black sm:max-h-[70px] bottom-0 left-0 ">
      {items.map((item) => (
        <SideBarItem
          labelClassName="hidden sm:block"
          key={item.href}
          item={item as any}
          isActive={item.isActive}
        />
      ))}
      <SideBarItem
        item={{
          icon: HiOutlineUser,
          label: "Profile",
          auth: true,
          onClick: () => {
            if (currentUser) {
              sidebar.onOpen();
            } else {
              loginModal.onOpen();
            }
          },
        }}
        isActive={pathname?.includes("users") && !pathname?.endsWith("users")}
        labelClassName="hidden sm:block"
      />
    </section>
  );
};

export default BottomBar;
