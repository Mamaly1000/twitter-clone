"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { IoMoon } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";

import DropDown from "@/components/ui/DropDown";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { MdOutlineLaptopChromebook } from "react-icons/md";

export function ModeToggle({ position }: { position?: string }) {
  const { setTheme } = useTheme();
  const { isScrolling } = useScrollAnimation({});
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isScrolling) {
      setOpen(false);
    }
  }, [isScrolling]);

  return (
    <DropDown
      className="overflow-visible"
      onDropDown={() => {
        setOpen((prev) => !prev);
      }}
      display={open}
      onClose={() => {
        setOpen(false);
      }}
      position={position}
      options={[
        {
          Icon: MdOutlineWbSunny,
          label: "Light",
          onClick: () => {
            setOpen(false);
            setTheme("light");
          },
        },
        {
          Icon: IoMoon,
          label: "Dark",
          onClick: () => {
            setOpen(false);
            setTheme("dark");
          },
        },
        {
          Icon: MdOutlineLaptopChromebook,
          label: "System",
          onClick: () => {
            setOpen(false);
            setTheme("system");
          },
        },
      ]}
    >
      <MdOutlineWbSunny className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IoMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </DropDown>
  );
}
