import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
interface ButtonProps {
  children: ReactNode;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: (e: any) => void;
  disabled?: boolean;
  outline?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
}
const Button = ({
  children,
  secondary = false,
  fullWidth = false,
  large = false,
  onClick,
  disabled = false,
  outline = false,
  type,
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={twMerge(
        ` 
    disabled:opacity-70
    disabled:cursor-not-allowed
    rounded-[50px]
    font-semibold
    hover:opacity-80
    transition hover:scale-105 active:scale-95 
    border-2`,
        fullWidth ? "w-full" : "w-fit",
        secondary
          ? "text-white bg-black border-[#566370]"
          : "bg-sky-500 text-white border-sky-500",
        large ? "text-xl px-5 py-3" : "text-md px-[24px] py-[4px]",
        outline ? "bg-black border-[#566370] text-white" : "",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
