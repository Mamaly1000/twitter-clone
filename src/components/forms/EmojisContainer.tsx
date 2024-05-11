import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { debounce, isEmpty } from "lodash";
import Loader from "../shared/Loader";
import { twMerge } from "tailwind-merge";
import SearchInput from "../inputs/SearchInput";
import Tabs from "../ui/Tabs";
import { emojiCategories } from "@/dummy/stickers";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
const EmojisContainer = ({
  show,
  onChange,
  onClose,
}: {
  onClose: () => void;
  onChange: (val: string) => void;
  show: boolean;
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-[110%] rounded-lg flex-col items-start justify-start gap-2 hidden md:flex "
        >
          <div
            className="w-[100000px] h-[100000px] absolute top-[-5000px] left-[-5000px]"
            onClick={onClose}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Picker
              theme={resolvedTheme}
              data={data}
              onEmojiSelect={(emoji: any) => {
                onChange(emoji.native);
              }}
            />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default EmojisContainer;
