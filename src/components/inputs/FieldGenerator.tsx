import React, { useState } from "react";
import Input from "./Input";
import { v4 as uuidv4 } from "uuid";
import { BiTrash } from "react-icons/bi";
import { GrAdd } from "react-icons/gr";
import { IconType } from "react-icons";
import { FaBirthdayCake } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { BsLink45Deg } from "react-icons/bs";
import FieldIcon from "../shared/FieldIcon";
import { without } from "lodash";
import { SingleCountryType } from "@/hooks/useCountry";
import { twMerge } from "tailwind-merge";
import CustomCalendar from "./Calendar";
import { format } from "date-fns";
import Link from "next/link";
import Tabs from "../ui/Tabs";
import TabContent from "../ui/TabContent";
export type FIELDTYPES = "LINK" | "BIRTHDAY" | "JOB";
export const ProfileFieldsTypes: {
  type: FIELDTYPES;
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
  const [selectedFieldType, setSelectedFieldType] = useState<FIELDTYPES | "">(
    ""
  );
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
        "min-w-full flex flex-col items-start justify-start gap-3 p-3 capitalize text-neutral-200 text-[15px] border-[1px] border-neutral-300 dark:border-neutral-800 rounded-md transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
    >
      <div className="min-w-full flex flex-col items-start justify-start gap-2">
        <Tabs
          onSelect={(val) => {
            if (!disabled) {
              setSelectedFieldType(val?.value as any);
            }
          }}
          className="items-center justify-start divide-x-[1px] divide-neutral-800"
          optionClassName="capitalize"
          options={ProfileFieldsTypes.map((t) => {
            return {
              label: t.label,
              value: t.type,
            };
          })}
          currentValue={{
            label: selectedFieldType.toLocaleLowerCase(),
            value: selectedFieldType,
          }}
        />
        <div className="min-w-full max-w-full flex flex-col items-start justify-start gap-2">
          {!!selectedFieldType && (
            <div className="min-w-full flex justify-between gap-2 items-center mt-3 overflow-hidden">
              <TabContent display={selectedFieldType === "JOB"}>
                <div className="flex items-center justify-between gap-2 flex-wrap w-full max-w-full">
                  <Input
                    name="value"
                    onChange={(e) => {
                      setActivefield({
                        type: selectedFieldType,
                        value: e.target.value,
                      });
                    }}
                    placeholder="your current job..."
                    className="w-[70%]"
                  />
                  <div className="flex items-center justify-start gap-2">
                    <button
                      onClick={() => {
                        if (activeField && activeField.value.length > 0) {
                          if (value.some((f) => f.type === activeField.type)) {
                            const updatedFields = [...value];
                            const index = updatedFields.findIndex(
                              (f) => f.type === activeField.type
                            );
                            updatedFields[index].value = activeField.value;
                            onChange(updatedFields);
                          } else {
                            onChange([
                              ...value,
                              {
                                type: selectedFieldType,
                                value: activeField.value,
                              },
                            ]);
                          }
                          setActivefield(null);
                          setSelectedFieldType("");
                        }
                      }}
                      className="text-sky-500 w-[40px] h-[40px] rounded-full border-[1px] border-neutral-300 dark:border-neutral-800 flex items-center justify-center"
                    >
                      <GrAdd size={20} />
                    </button>
                  </div>
                </div>
              </TabContent>
              <TabContent display={selectedFieldType === "LINK"}>
                <div className="flex items-center justify-between gap-2 flex-wrap w-full max-w-full">
                  <Input
                    name="value"
                    onChange={(e) => {
                      setActivefield({
                        type: selectedFieldType,
                        value: e.target.value,
                      });
                    }}
                    placeholder="write your community link..."
                    className="w-[70%]"
                  />
                  <div className="flex items-center justify-start gap-2">
                    <button
                      onClick={() => {
                        if (activeField && activeField.value.length > 0) {
                          if (value.some((f) => f.type === activeField.type)) {
                            const updatedFields = [...value];
                            const index = updatedFields.findIndex(
                              (f) => f.type === activeField.type
                            );
                            updatedFields[index].value = activeField.value;
                            onChange(updatedFields);
                          } else {
                            onChange([
                              ...value,
                              {
                                type: selectedFieldType,
                                value: activeField.value,
                              },
                            ]);
                          }
                          setActivefield(null);
                          setSelectedFieldType("");
                        }
                      }}
                      className="text-sky-500 w-[40px] h-[40px] rounded-full border-[1px] border-neutral-300 dark:border-neutral-800 flex items-center justify-center"
                    >
                      <GrAdd size={20} />
                    </button>
                  </div>
                </div>
              </TabContent>
              <TabContent display={selectedFieldType === "BIRTHDAY"}>
                <CustomCalendar
                  onChange={(date) => {
                    if (value.some((f) => f.type === selectedFieldType)) {
                      const updatedFields = [...value];
                      const index = updatedFields.findIndex(
                        (f) => f.type === selectedFieldType
                      );
                      if (index > 0) {
                        updatedFields[index].value = date.toISOString();
                        onChange(updatedFields);
                      }
                    } else {
                      onChange([
                        ...value,
                        {
                          type: "BIRTHDAY",
                          value: date.toISOString(),
                        },
                      ]);
                    }
                    setActivefield(null);
                    setSelectedFieldType("");
                  }}
                />
              </TabContent>
            </div>
          )}
        </div>
        <div className="min-w-full flex flex-col items-start justify-start gap-1 mt-2">
          {value.map((f) => (
            <div
              key={uuidv4()}
              className="min-w-full flex items-center justify-between gap-2"
            >
              <div className="flex items-center justify-start gap-1 text-[15px] text-neutral-300">
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
                className="text-red-400 border-[1px] border-neutral-300 dark:border-neutral-800 w-[30px] h-[30px] rounded-md flex items-center justify-center"
                disabled={disabled}
              >
                <BiTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldGenerator;
