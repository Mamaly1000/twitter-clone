import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { FaFeather } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const SideBarTweetButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { isScrolling } = useScrollAnimation({});
  const { data: currentUser } = useCurrentUser();
  const loginModal = useLoginModal();
  const onClick = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    router.push("/create");
  }, [loginModal, router, currentUser]);
  return (
    <>
      <motion.div
        className={twMerge(
          `mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-sky-500 hover:bg-opacity-80 transition-all cursor-pointer`,
          className
        )}
        animate={{
          scale: isScrolling ? 0 : 1,
        }}
        transition={{
          ease: "linear",
          duration: 0.12,
        }}
        onClick={onClick}
      >
        <FaFeather size={24} color="white" />
      </motion.div>
      <div
        className={twMerge(
          "mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-90 cursor-pointer md:min-w-full ",
          className
        )}
        onClick={onClick}
      >
        <p
          className="
        hidden 
        md:block 
        text-center
        font-semibold
        text-white 
        text-[20px]
    "
        >
          Tweet
        </p>
      </div>
    </>
  );
};

export default SideBarTweetButton;
