import { useRouter } from "next/router";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const SearchInput = ({
  className,
  size = 15,
  name,
  onChange,
  placeholder,
  inputClassName,
  disabled,
  autoFocus,
}: {
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  size?: number;
  name?: string;
  onChange?: (e: any) => void;
  placeholder?: string;
  inputClassName?: string;
}) => {
  return (
    <section
      className={twMerge(
        "group flex items-center justify-start gap-2 p-[10px] rounded-[50px] border-[1.21px] border-sky-500 text-sm  min-w-full max-w-full hover:border-sky-600 hover:shadow-md shadow-sky-300 disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
    >
      <FiSearch
        className="text-[#71767b] group-hover:text-sky-600"
        size={size}
      />
      <input
        className={twMerge(
          "placeholder:text-[#71767b] bg-light dark:bg-black outline-none focus-within:outline-none focus:outline-none focus-visible:outline-none border-none pe-2 capitalize dark:text-white text-text-primary",
          inputClassName
        )}
        autoFocus={autoFocus}
        disabled={disabled}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
      />
    </section>
  );
};

export default SearchInput;
