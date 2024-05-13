import React from "react";
import { twMerge } from "tailwind-merge";
interface InputProps {
  placeholder?: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name: string;
  register?: any;
  className?: string;
  autofocus?: boolean;
}
const Input = ({
  onChange,
  disabled,
  label,
  placeholder,
  type,
  value,
  name,
  register,
  autofocus,
  className,
}: InputProps) => {
  return (
    <div className={twMerge("w-full", className)}>
      {label && (
        <p className="text-xl dark:text-white text-text-primary font-semibold mb-2">
          {label}
        </p>
      )}
      <input
        name={name}
        {...register}
        disabled={disabled}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        autoFocus={autofocus}
        type={type}
        className={twMerge(
          "w-full p-4 text-lg bg-light dark:bg-black border-2 border-neutral-300 dark:border-neutral-800 rounded-md outline-none dark:text-white text-text-primary focus:border-sky-500 focus:border-2 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed"
        )}
      />
    </div>
  );
};

export default Input;
