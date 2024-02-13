import React from "react";
import { HashLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

const Loader = ({
  message,
  size = 80,
  className,
}: {
  className?: string;
  size?: number;
  message?: string;
}) => {
  return (
    <div
      className={twMerge(
        "flex justify-center items-center flex-col gap-3 min-h-[400px] ",
        className
      )}
    >
      <HashLoader color="#008FFB" size={size} />
      {message && (
        <p className="capitalize font-semibold text-center text-white">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
