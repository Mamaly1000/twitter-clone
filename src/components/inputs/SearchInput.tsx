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
}: {
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
        "flex items-center justify-start gap-2 p-[10px] rounded-full border-[1px] border-sky-500 text-sm  min-w-full max-w-full",
        className
      )}
    >
      <FiSearch className="text-[#71767b]" size={size} />
      <input
        className={twMerge(
          "placeholder:text-[#71767b] bg-black outline-none focus-within:outline-none focus:outline-none focus-visible:outline-none border-none pe-2 capitalize text-white",
          inputClassName
        )}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
      />
    </section>
  );
};

export default SearchInput;
