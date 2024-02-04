import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { IconType } from "react-icons";
import { BsDot } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
interface Props {
  item: {
    label: string;
    icon: IconType;
    href?: string;
    auth?: boolean;
    alert?: undefined;
    onClick?: () => void;
  };
  labelClassName?: string;
}
const SideBarItem = ({
  item: { label, icon: Icon, href, alert, onClick, auth = false },
  labelClassName,
}: Props) => {
  const { data: currentUser } = useCurrentUser();
  const loginModal = useLoginModal();
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }
    if (auth && !currentUser) {
      loginModal.onOpen();
    } else if (href) {
      router.push(href);
    }
  }, [router, href, auth, loginModal, onClick, currentUser]);
  return (
    <div onClick={handleClick} className="flex flex-row items-center">
      <div
        className="
        relative
        rounded-full 
        h-14
        w-14
        flex
        items-center
        justify-center 
        p-4
        hover:bg-slate-300 
        hover:bg-opacity-10 
        cursor-pointer 
        lg:hidden
      "
      >
        <Icon size={24} color="white" />
        {alert ? (
          <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} />
        ) : null}
      </div>
      <div
        className="
        relative
        min-w-full
        hidden 
        lg:flex 
        items-row 
        gap-4 
        px-4 py-3  transition-all
        rounded-md 
        hover:bg-slate-300 
        hover:bg-opacity-10 
        cursor-pointer
        items-center
      "
      >
        <Icon size={20} />
        <p
          className={twMerge(
            "hidden lg:block font-bold capitalize",
            labelClassName
          )}
        >
          {label}
        </p>
        {alert ? (
          <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} />
        ) : null}
      </div>
    </div>
  );
};

export default SideBarItem;
