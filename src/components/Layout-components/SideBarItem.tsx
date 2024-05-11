import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
interface Props {
  item: {
    label: string;
    icon: IconType;
    href?: string;
    auth?: boolean;
    alert?: number;
    onClick?: () => void;
  };
  labelClassName?: string;
  className?: string;
  isActive?: boolean;
  iconSize?: number;
  bottomBar?: boolean;
  mobile?: boolean;
}
const SideBarItem = ({
  item: { label, icon: Icon, href, alert, onClick, auth = false },
  className,
  isActive,
  iconSize = 20,
  bottomBar = false,
  mobile = false,
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
      className={twMerge(
        `flex flex-row items-center justify-start gap-1 md:gap-3 p-2
         hover:bg-slate-600 dark:hover:bg-slate-300 
         hover:bg-opacity-10 dark:hover:bg-opacity-10 
         rounded-full cursor-pointer`,
        isActive
          ? " text-text-primary dark:text-white"
          : " text-gray-700 dark:text-[#e9e7ea]",
        className
      )}
    >
      <motion.div
        className={twMerge(
          "relative rounded-full flex items-center justify-center p-1 cursor-pointer active:scale-95"
        )}
        animate={{
          width: iconSize + 10,
          height: iconSize + 10,
        }}
      >
        <Icon
          size={isActive ? iconSize + 5 : iconSize}
          className={twMerge(
            isActive
              ? "font-extrabold text-black dark:text-white fill-black dark:fill-white "
              : ""
          )}
        />
        {!!!alert && isActive && (
          <span className="min-w-[10px] min-h-[10px] rounded-full bg-sky-500 absolute top-0 right-0 "></span>
        )}
        {!!alert && (
          <span
            className={twMerge(
              " rounded-full bg-sky-600 absolute top-0 text-white right-0 flex items-center justify-center font-light",
              bottomBar
                ? "min-w-[10px] min-h-[10px] text-[12px] max-w-[10px] max-h-[10px]"
                : "min-w-[22px] min-h-[22px] text-[12px] max-w-[22px] max-h-[22px]"
            )}
          >
            {!bottomBar && (alert > 10 ? `+9` : alert)}
          </span>
        )}
      </motion.div>
      <p
        className={twMerge(
          ` pe-3 cursor-pointer hidden lg:block
          font-[400] leading-[24px] text-[17px] lg:text-[20px]  capitalize 
          text-gray-700 dark:text-[#e7e9ea] `,
          isActive && " font-bold",
          bottomBar && "hidden sm:block",
          mobile && "block"
        )}
      >
        {label}
      </p>
    </div>
  );
};

export default SideBarItem;
