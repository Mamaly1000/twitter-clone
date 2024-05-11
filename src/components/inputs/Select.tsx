import useCountry, { SingleCountryType } from "@/hooks/useCountry";
import React, { useEffect, useState } from "react";
import { BiSolidCity } from "react-icons/bi";
import Select from "react-select";
import { twMerge } from "tailwind-merge";
import { FaEarthAsia } from "react-icons/fa6";

const CountrySelect = ({
  onChange,
  value,
  className,
}: {
  value?: SingleCountryType;
  onChange: (value: SingleCountryType) => void;
  className?: string;
}) => {
  const { getAll } = useCountry();
  const [allCountries, setAllcountries] = useState<SingleCountryType[]>([]);

  useEffect(() => {
    setAllcountries(getAll());
  }, [getAll, setAllcountries]);

  return (
    <div className={twMerge(" relative", className)}>
      <Select
        placeholder="AnyWhere"
        isClearable
        options={allCountries}
        value={value}
        onChange={(newval) => {
          onChange(newval as SingleCountryType);
        }}
        formatOptionLabel={(data) => {
          return (
            !!data.value &&
            !!data.city &&
            !!data.label && (
              <div className="flex flex-row px-1 items-center justify-start text-white hover:text-sky-400 gap-2 min-w-full max-w-full line-clamp-1">
                <span className="text-nowrap flex items-center justify-center gap-1 text-inherit">
                  <FaEarthAsia size={12} />
                  {data.label},{" "}
                </span>
                <span className="text-neutral-300 text-inherit text-nowrap">
                  {data.region}
                </span>
                <span className="text-neutral-300 flex items-center justify-center gap-1 text-inherit text-nowrap">
                  <BiSolidCity size={12} />
                  {data.city}
                </span>
              </div>
            )
          );
        }}
        classNames={{
          control: (base) =>
            twMerge(
              base.className,
              "p-3 border-2 border-neutral-300 bg-light dark:bg-black overflow-hidden"
            ),
          input: (base) =>
            twMerge(
              base.className,
              " text-lg bg-light dark:bg-black text-white"
            ),
          option: (base) =>
            twMerge(base.className, " text-lg bg-light dark:bg-black"),
          valueContainer: (base) =>
            twMerge(
              base.className,
              " bg-light dark:bg-black text-white text-[12px] flex-row min-w-[70%] max-w-[70%] "
            ),
          placeholder: (base) => twMerge(base.className, " text-neutral-300"),
          container: (base) =>
            twMerge(base.className, " bg-light dark:bg-black"),
          indicatorsContainer: (base) =>
            twMerge(
              base.className,
              " bg-light dark:bg-black text-neutral-300 hover:text-neutral-100"
            ),
          singleValue: (base) =>
            twMerge(base.className, " bg-light dark:bg-black"),
          multiValueLabel: (base) =>
            twMerge(base.className, " bg-light dark:bg-black"),
          menu: (base) => twMerge(base.className, " bg-light dark:bg-black"),
          menuList: (base) =>
            twMerge(
              base.className,
              " bg-light dark:bg-black border-[1px] border-neutral-300 dark:border-neutral-800 rounded-md"
            ),
          menuPortal: () => twMerge(" bg-light dark:bg-black text-red-400"),
          group: (base) => twMerge(base.className + " bg-light dark:bg-black"),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "rgb(56 189 248 / .25)",
            primary25: "rgb(56 189 248 / .25)",
            primary50: "rgb(56 189 248 / .5)",
            primary75: "rgb(56 189 248 / .75)",
          },
        })}
        styles={{
          container: (base) => {
            return { ...base, background: "transparent", color: "#fff" };
          },
          control: (base) => {
            return {
              ...base,
              background: "transparent",
            };
          },
          input: (base) => {
            return { ...base, background: "transparent", color: "#fff" };
          },
          menuList: (base) => {
            return {
              ...base,
              background: "black",
            };
          },
          option: (base) => {
            return {
              ...base,
              ":hover": {
                backgroundColor: "rgb(56 189 248 / .2)",
                background: "rgb(56 189 248 / .2)",
              },
            };
          },
        }}
      />
    </div>
  );
};

export default CountrySelect;
