import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { FaFeather } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

const SideBarTweetButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const loginModal = useLoginModal();
  const onClick = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    router.push("/create");
  }, [loginModal, router, currentUser]);
  return (
    <div className="lg:min-w-full" onClick={onClick}>
      <div
        className={twMerge(
          `mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-sky-500 hover:bg-opacity-80 transition-all cursor-pointer`,
          className
        )}
      >
        <FaFeather size={24} color="white" />
      </div>
      <div
        className={twMerge(
          "mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-90 cursor-pointer lg:min-w-full ",
          className
        )}
      >
        <p
          className="
        hidden 
        lg:block 
        text-center
        font-semibold
        text-white 
        text-[20px]
    "
        >
          Tweet
        </p>
      </div>
    </div>
  );
};

export default SideBarTweetButton;
