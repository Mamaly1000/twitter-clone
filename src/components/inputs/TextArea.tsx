import React from "react";
import { twMerge } from "tailwind-merge";

const TextArea = ({
  name,
  register,
  disabled,
  onChange,
  value,
  placeholder,
  type,
  className,
}: {
  className?: string;
  name: string;
  register?: any;
  disabled?: boolean;
  onChange: (e: any) => void;
  value: string;
  placeholder?: string;
  type?: string;
}) => {
  return (
    <textarea
      name={name}
      {...register}
      disabled={disabled}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      type={type}
      className={twMerge(
        "w-full p-4 text-lg bg-light dark:bg-black border-2 border-neutral-300 dark:border-neutral-800 rounded-md outline-none text-text-primary dark:text-white focus:border-sky-500 focus:border-2 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
    ></textarea>
  );
};

export default TextArea;
