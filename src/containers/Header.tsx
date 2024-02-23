import useScrollAnimation from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

const Header = ({
  label,
  displayArrow = false,
  subHeader,
}: {
  subHeader?: string;
  displayArrow?: boolean;
  label: string;
}) => {
  const { scrolled, isScrolling } = useScrollAnimation({});
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <motion.div
      className={twMerge(
        "border-b-[1px] border-neutral-800 p-5 transition-all z-50",
        scrolled
          ? "sticky top-0 left-0 bg-black px-2 py-3 font-semibold bg-opacity-70 backdrop-blur-sm"
          : "relative bg-transparent"
      )}
      animate={{
        translateY: isScrolling ? -400 : 0,
      }}
    >
      <div className="flex flex-row items-center justify-between gap-2 text-sky-500">
        <div className="max-w-fit flex items-center justify-start gap-2">
          {displayArrow && (
            <BiArrowBack
              onClick={handleBack}
              size={20}
              className="cursor-pointer hover:opacity-70 transition"
            />
          )}
          <h1
            className={twMerge(
              "text-white text-xl font-semibold capitalize flex flex-col items-start justify-start leading-[20px]",
              scrolled ? " font-semibold" : ""
            )}
          >
            {label}
            {!!subHeader && (
              <p className="text-[12px] text-[#72767A] ">{subHeader}</p>
            )}
          </h1>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
