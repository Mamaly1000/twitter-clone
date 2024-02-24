import React from "react";
import { BounceLoader, HashLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

const Loader = ({
  message,
  size = 80,
  className,
  type,
  speed,
}: {
  speed?: number;
  type?: "bounce";
  className?: string;
  size?: number;
  message?: string;
}) => {
  const color = "#008FFB";
  return (
    <div
      className={twMerge(
        "flex justify-center items-center flex-col gap-3 min-h-[400px] ",
        className
      )}
    >
      {!!!type && (
        <HashLoader speedMultiplier={speed || 1} color={color} size={size} />
      )}
      {type === "bounce" && (
        <BounceLoader speedMultiplier={speed || 1} color={color} size={size} />
      )}
      {message && (
        <p className="capitalize font-semibold text-center text-white">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
