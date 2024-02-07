import { useRouter } from "next/router";
import React from "react";
import { BsTwitter } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

const SideBarLogo = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/")}
      className={twMerge(
        "rounded-full w-10 h-10 md:h-14 md:w-14 p-1 md:p-4 flex items-center justify-center hover:bg-blue-300 hover:bg-opacity-10 cursor-pointer transition-all",
        className
      )}
    >
      <BsTwitter size={24} color="white" />
    </div>
  );
};

export default SideBarLogo;
