import { format } from "date-fns";
import React, { useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { twMerge } from "tailwind-merge";
const CustomCalendar = ({
  className,
  onChange,
}: {
  onChange: (date: Date) => void;
  className?: string;
}) => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div
      className={twMerge(
        "min-w-full max-w-full flex items-center justify-center gap-2 flex-col",
        className
      )}
    >
      <Calendar
        onChange={(item) => setDate(item)}
        date={date}
        color="rgb(56 189 248 / .3)"
        classNames={{
          calendarWrapper:
            "bg-transparent text-white rounded-md border-[1px] border-neutral-300 dark:border-neutral-800 ",
          day: "text-black",
        }}
        className="text-white    overflow-auto text-[10px] sm:text-[12px]"
        maxDate={new Date()}
      />
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 md:gap-10 border-[1px] border-neutral-300 dark:border-neutral-800 px-2 sm:px-3 py-2  rounded-md text-[12px] w-full md:w-fit md:text-sm">
        <div className="flex items-center justify-center md:justify-start gap-2 text-sky-300 capitalize font-semibold w-full md:w-fit  ">
          <span>your birthday : </span>
          <span>{format(date, "dd-MMMM-yyyy")}</span>
        </div>
        <button
          className="px-3 py-2 rounded-md capitalize hover:scale-105 transition-all border-[1px] border-white active:scale-95 "
          onClick={() => {
            onChange(date);
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default CustomCalendar;
