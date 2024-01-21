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
import UsersList from "@/components/lists/UsersList";
import useUsers from "@/hooks/useUsers";
const SideBar = () => {
  const { data: currentUser } = useCurrentUser();
  const { users } = useUsers();
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
    <section className="hidden lg:block  col-span-1 h-full pr-4 md:pr-6 lg:pr-3">
      <div className="flex flex-col items-end ">
        <div className="space-y-2 *:transition-all lg:w-[230px] ">
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
          <section className="hidden lg:block xl:hidden">
            <UsersList title="Who to follow" users={users} />
          </section>
        </div>
      </div>
    </section>
  );
};

export default SideBar;
