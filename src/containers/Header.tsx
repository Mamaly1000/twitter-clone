import { ModeToggle } from "@/components/inputs/ToggleTheme";
import Avatar from "@/components/shared/Avatar";
import SideBarLogo from "@/components/shared/SideBarLogo";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import useSidebar from "@/hooks/useSidebar";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

const Header = ({
  label,
  displayArrow = false,
  subHeader,
  displayProfile,
  main,
}: {
  profilePage?: boolean;
  main?: boolean;
  displayProfile?: boolean;
  subHeader?: string;
  displayArrow?: boolean;
  label: string;
}) => {
  const { scrolled, isScrolling } = useScrollAnimation({});
  const router = useRouter();
  const sidebar = useSidebar();
  const loginModal = useLoginModal();
  const { data: user } = useCurrentUser();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <motion.div
      className={twMerge(
        "border-b-[1px] top-0 left-0 sticky   bg-light dark:bg-black border-neutral-300 dark:border-neutral-800 px-2 md:px-5 py-2 transition-all z-50",
        scrolled ? " backdrop-blur-sm" : " "
      )}
      animate={{
        translateY: isScrolling && scrolled ? -400 : 0,
      }}
    >
      <div className="flex flex-row items-center justify-between gap-2 text-sky-500">
        <div
          className={twMerge(
            "min-w-full max-w-full flex items-center gap-3 text-btn-primary",
            main ? "justify-between" : "justify-start"
          )}
        >
          {displayArrow && (
            <BiArrowBack
              onClick={handleBack}
              size={20}
              className="cursor-pointer hover:opacity-70 transition"
            />
          )}
          {displayProfile && user && (
            <div className="flex items-center justify-start gap-3">
              <Avatar
                onClick={() => {
                  if (user) {
                    sidebar.onOpen();
                  } else {
                    loginModal.onOpen();
                  }
                }}
                userId={user.id}
                className="md:hidden w-[35px] h-[35px]"
              />
              <Avatar
                onClick={() => {
                  if (user) {
                    router.push(`/users/${user.id}`);
                  } else {
                    loginModal.onOpen();
                  }
                }}
                userId={user.id}
                className="hidden md:block min-w-[35px] min-h-[35px] max-w-[35px] max-h-[35px]"
              />
            </div>
          )}
          {!main ? (
            <h1
              className={twMerge(
                "text-text-primary dark:text-white text-xl font-semibold capitalize flex flex-col items-start justify-start leading-[20px]",
                scrolled ? " font-semibold" : ""
              )}
            >
              {label}
              {!!subHeader && (
                <span className="text-[12px] text-[#72767A] ">{subHeader}</span>
              )}
            </h1>
          ) : (
            <>
              <div className="flex items-center justify-start gap-3 min-w-fit  md:hidden">
                <ModeToggle position="right-0 top-[100%]" />
                <SideBarLogo className="py-0 w-[35px] h-[35px] md:hidden" />
              </div>
              <h1
                className={twMerge(
                  "dark:text-white text-text-primary md:me-8 hidden text-xl font-semibold capitalize md:flex flex-col items-start justify-start leading-[20px]",
                  scrolled ? " font-semibold" : ""
                )}
              >
                {label}
              </h1>
            </>
          )}

          <div
            className={twMerge("absolute right-2", main && "hidden md:block")}
          >
            <ModeToggle position="right-0 top-[100%]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
