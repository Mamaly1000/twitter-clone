import React, { useState } from "react";
import Input from "./Input";
import { v4 as uuidv4 } from "uuid";
import { BiTrash } from "react-icons/bi";
import { GrAdd, GrLocation } from "react-icons/gr";
import { IconType } from "react-icons";
import { FaBirthdayCake } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { BsLink45Deg } from "react-icons/bs";
import FieldIcon from "../shared/FieldIcon";
import { without } from "lodash";
import CountrySelect from "./Select";
import { SingleCountryType } from "@/hooks/useCountry";
import { twMerge } from "tailwind-merge";
import CustomCalendar from "./Calendar";
import { format } from "date-fns";
import { FaEarthAsia } from "react-icons/fa6";
import Link from "next/link";
export const ProfileFieldsTypes: {
  type: "LINK" | "BIRTHDAY" | "JOB";
  label: "link" | "birthday" | "job";
  Icon: IconType;
}[] = [
  {
    type: "BIRTHDAY",
    label: "birthday",
    Icon: FaBirthdayCake,
  },
  {
    type: "JOB",
    label: "job",
    Icon: MdWorkHistory,
  },
  {
    type: "LINK",
    label: "link",
    Icon: BsLink45Deg,
  },
];

const FieldGenerator = ({
  onChange,
  value,
  disabled = false,
}: {
  disabled?: boolean;
  value: {
    value: string;
    type: "LINK" | "BIRTHDAY" | "JOB";
  }[];
  onChange: (
    fields: {
      value: string;
      type: "LINK" | "BIRTHDAY" | "JOB";
    }[]
  ) => void;
}) => {
  const [activeField, setActivefield] = useState<null | {
    value: string;
    type: "LINK" | "BIRTHDAY" | "JOB";
  }>(null);
  const [location, setLocation] = useState<SingleCountryType>({
    city: "",
    label: "",
    region: "",
    value: "",
  });

  return (
    <div
      className={twMerge(
        "min-w-full flex flex-col items-start justify-start gap-3 p-3 capitalize text-neutral-200 text-[15px] border-[1px] border-neutral-800 rounded-md transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
    >
      <div className="min-w-full flex flex-col items-start justify-start gap-2">
        <div className="min-w-full flex flex-wrap items-center capitalize justify-start gap-3 ">
          <span className="text-[14px] capitalize text-neutral-200">
            select field type :
          </span>
          <div className="flex items-start justify-start flex-wrap gap-2 ">
            {ProfileFieldsTypes.map((t) => {
              return (
                <button
                  className={twMerge(
                    "px-2 py-1 rounded-md border-[1px]  hover:scale-105 transition-all ",
                    t.type === activeField?.type
                      ? "border-sky-400 text-sky-400"
                      : "border-white text-white",
                    disabled ? "cursor-not-allowed" : ""
                  )}
                  key={t.type}
                  onClick={(e) => {
                    if (disabled) {
                      e.preventDefault();
                    } else {
                      setActivefield({
                        type: t.type,
                        value: location?.value ? location.value : "",
                      });
                    }
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="min-w-full max-w-full flex flex-col items-start justify-start gap-2">
          {!!activeField && (
            <div className="min-w-full flex justify-between gap-2 items-center mt-3">
              {(activeField.type === "LINK" || activeField.type === "JOB") && (
                <div className="flex items-center justify-start gap-2 flex-wrap w-5/6">
                  <Input
                    name="value"
                    onChange={(e) => {
                      setActivefield({
                        ...activeField,
                        value: e.target.value,
                      });
                    }}
                    placeholder="value"
                    className="w-[45%]"
                  />
                </div>
              )}

              {activeField.type === "BIRTHDAY" && (
                <CustomCalendar
                  onChange={(date) => {
                    onChange([
                      ...value,
                      {
                        type: "BIRTHDAY",
                        value: date.toISOString(),
                      },
                    ]);
                    setActivefield(null);
                  }}
                />
              )}
              {activeField.type !== "BIRTHDAY" && (
                <div className="flex items-center justify-start gap-2">
                  <button
                    onClick={() => {
                      setActivefield(null);
                    }}
                    className="text-red-400  w-[45px] h-[45px] rounded-full border-[1px] border-neutral-800 flex items-center justify-center"
                  >
                    <BiTrash size={25} />
                  </button>
                  <button
                    onClick={() => {
                      if (activeField.value.length > 0) {
                        onChange([
                          ...value,
                          {
                            type: activeField.type,
                            value: activeField.value,
                          },
                        ]);
                        setActivefield(null);
                      }
                    }}
                    className="text-green-400 w-[45px] h-[45px] rounded-full border-[1px] border-neutral-800 flex items-center justify-center"
                  >
                    <GrAdd size={25} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="min-w-full flex flex-col items-start justify-start gap-1 mt-2">
          {value.map((f) => (
            <div
              key={uuidv4()}
              className="min-w-full flex items-center justify-between gap-2"
            >
              <div className="flex items-center justify-start gap-1 text-[13px] text-neutral-300">
                <FieldIcon type={f.type} />
                <span className="flex px-1 cursor-default flex-row items-center justify-start text-white hover:text-sky-400 gap-2   line-clamp-1">
                  {f.type === "BIRTHDAY" &&
                    format(new Date(f.value), "dd-MMMM-yyyy")}
                  {f.type === "JOB" && f.value}
                  {f.type === "LINK" && (
                    <Link className="underline" href={f.value} target="_blank">
                      {f.value}
                    </Link>
                  )}
                </span>
              </div>
              <button
                onClick={() => {
                  const newlist = without(value, f);
                  onChange(newlist);
                }}
                className="text-red-400 w-[30px] h-[30px] rounded-md flex items-center justify-center"
              >
                <BiTrash size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldGenerator;
