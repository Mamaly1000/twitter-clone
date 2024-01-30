import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

const Header = ({
  label,
  displayArrow = false,
  subHeader,
}: {
  subHeader?: string;
  displayArrow?: boolean;
  label: string;
}) => {
  const router = useRouter();
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <div className="border-b-[1px] border-neutral-800 p-5">
      <div className="flex flex-row items-center gap-2 text-sky-500">
        {displayArrow && (
          <BiArrowBack
            onClick={handleBack}
            size={20}
            className="cursor-pointer hover:opacity-70 transition"
          />
        )}
        <h1 className="text-white text-xl font-semibold capitalize flex flex-col items-start justify-start ">
          {label}
          {!!subHeader && <p className="text-[12px] text-[#72767A] ">{subHeader}</p>}
        </h1>
      </div>
    </div>
  );
};

export default Header;
