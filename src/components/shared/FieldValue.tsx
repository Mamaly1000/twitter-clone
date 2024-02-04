import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import FieldIcon from "./FieldIcon";
import { format } from "date-fns";
import Link from "next/link";
import useCountry from "@/hooks/useCountry";

const FieldValue = ({
  className,
  f,
  size,
}: {
  f: { value: string; type: any };
  className?: string;
  size: number;
}) => {
  const { getByValue } = useCountry();
  const location = useMemo(() => {
    if (f.type === "LOCATION") {
      const currentLocation = getByValue(f.value);
      return `${currentLocation?.label}, ${currentLocation?.region}, ${currentLocation?.city}`;
    }
    return null;
  }, [f.type]);
  return (
    <div
      className={twMerge(
        "flex items-center justify-start gap-2 w-fit ",
        className
      )}
      style={{ fontSize: "inherit" }}
    >
      <FieldIcon size={size} type={f.type} />
      <span
        className="flex  cursor-default flex-row items-center justify-start gap-2 line-clamp-1 text-inherit from-inherit"
        style={{ fontSize: "inherit" }}
      >
        {f.type === "BIRTHDAY" && format(new Date(f.value), "dd-MMMM-yyyy")}
        {f.type === "LOCATION" && location}
        {f.type === "JOB" && f.value}
        {f.type === "LINK" && (
          <Link
            className="underline text-sky-500"
            href={f.value}
            target="_blank"
          >
            {f.value}
          </Link>
        )}
      </span>
    </div>
  );
};

export default FieldValue;
