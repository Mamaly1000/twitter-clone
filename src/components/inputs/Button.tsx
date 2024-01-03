import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
interface ButtonProps {
  children: ReactNode;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  outline?: boolean;
}
const Button = ({
  children,
  secondary = false,
  fullWidth = false,
  large = false,
  onClick,
  disabled = false,
  outline = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        ` 
    disabled:opacity-70
    disabled:cursor-not-allowed
    rounded-full
    font-semibold
    hover:opacity-80
    transition
    border-2`,
        fullWidth ? "w-full" : "w-fit",
        secondary
          ? "bg-white text-black border-black"
          : "bg-sky-500 text-white border-sky-500",
        large ? "text-xl px-5 py-3" : "text-md px-4 py-2",
        outline ? "bg-transparent border-white text-white" : ""
      )}
    >
      {children}
    </button>
  );
};

export default Button;
