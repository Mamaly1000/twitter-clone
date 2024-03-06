import React from "react";
import { twMerge } from "tailwind-merge";
import { profileTabsType } from "../../pages/users/[user_id]/index";

const Tabs = ({
  options,
  currentValue,
  className,
  optionClassName,
  onSelect,
}: {
  onSelect: (val: {
    disabled?: boolean;
    label: profileTabsType | string;
    value: string;
  }) => void;
  optionClassName?: string;
  className?: string;
  options: {
    disabled?: boolean;
    label: profileTabsType | string;
    value: string;
  }[];
  currentValue?: {
    disabled?: boolean;
    label?: profileTabsType | string;
    value?: string;
  };
}) => {
  return (
    <section
      className={twMerge(
        "tab-container overflow-y-hidden relative z-0 min-w-full max-w-full overflow-x-auto flex flex-row items-center justify-between  p-0 m-0 [&>button]:first:rounded-bl-md [&>button]:last:rounded-br-md",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          className={twMerge(
            "relative z-10 min-w-fit flex items-center justify-center px-5 w-max py-4 text-neutral-400 capitalize text-[14px]  font-semibold disabled:cursor-default disabled:opacity-60",
            currentValue?.value === option.value ? "text-white  " : " ",
            optionClassName
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option);
          }}
          disabled={option.disabled}
        >
          {option.label}
          <span
            className={twMerge(
              "min-h-[3px] max-h-[3px] bottom-0 absolute bg-sky-600 shadow-2xl shadow-white  transition-all z-20",
              !!(currentValue?.label === option.label)
                ? "min-w-full max-w-full"
                : "min-w-0 max-w-0"
            )}
          ></span>
        </button>
      ))}
      <span className="border-b-[1px] border-b-neutral-800 absolute z-0 min-w-full min-h-[3px] bottom-0"></span>
    </section>
  );
};

export default Tabs;
