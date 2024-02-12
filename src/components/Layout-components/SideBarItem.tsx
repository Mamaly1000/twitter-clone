import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { IconType } from "react-icons";
import { BsDot } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
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
  className?: string;
  isActive?: boolean;
}
const SideBarItem = ({
  item: { label, icon: Icon, href, alert, onClick, auth = false },
  labelClassName,
  className,
  isActive,
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
    <div
      onClick={handleClick}
      className={twMerge("flex flex-row items-center", className)}
    >
      <div
        className={twMerge(
          "relative rounded-full h-10 w-10 md:h-14 md:w-14 flex items-center justify-center p-1 md:p-4   hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer lg:hidden active:scale-95",
          isActive
            ? "text-sky-500 scale-110   font-bold stroke-2"
            : "scale-100  "
        )}
      >
        <Icon size={20} color={isActive ? "inherit" : "white"} />
        {alert ? (
          <FaCircle className="text-sky-500 absolute top-2 right-2 md:right-3 md:top-3 max-w-[30px] max-h-[30px] " size={14} />
        ) : null}
      </div>
      <p
        className={twMerge(
          "hidden md:block pe-3 lg:hidden cursor-pointer font-bold capitalize text-[14px] text-[#d9d9d9]",
          isActive && "text-sky-500",
          labelClassName
        )}
      >
        {label}
      </p>
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
        <p className={twMerge("  font-bold capitalize", labelClassName)}>
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
