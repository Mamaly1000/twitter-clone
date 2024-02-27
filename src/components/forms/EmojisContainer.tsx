import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Input from "../inputs/Input";
import { debounce, isEmpty } from "lodash";
import useEmoji from "@/hooks/useEmoji";
import Loader from "../shared/Loader";
import { twMerge } from "tailwind-merge";

const EmojisContainer = ({
  show,
  onChange,
}: {
  onChange: (val: string) => void;
  show: boolean;
}) => {
  const { emojis, setSearch, isLoading } = useEmoji(show);
  const searchDebounce = debounce((val) => {
    setSearch(val);
  }, 1000);

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-[110%] w-[300px] h-[300px] max-h-[300px] max-w-[300px] rounded-lg bg-neutral-900 border-[1px] border-neutral-800 p-2 flex flex-col items-start justify-start gap-2 overflow-auto"
        >
          <Input
            name="emoji-search"
            onChange={(e) => {
              searchDebounce(e.target.value);
            }}
            className="sticky z-10 top-0"
            placeholder="search your emoji..."
          />
          <section className="min-w-full max-w-full flex flex-wrap items-center justify-center gap-1 relative z-0">
            {emojis?.slice(0, 50).map(
              (e, index) =>
                !["🫠", "🥲"].includes(e.character) && (
                  <motion.button
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: index / 10 + 0.01,
                    }}
                    key={e.codePoint}
                    className={twMerge(
                      "min-w-fit w-[40px] h-[40px] max-h-[40px] text-[20px] rounded-lg drop-shadow-2xl border-[1px] border-neutral-800 flex items-center justify-center "
                    )}
                    onClick={() => onChange(e.character)}
                  >
                    {e.character}
                  </motion.button>
                )
            )}
            {isLoading && (
              <Loader
                className="min-h-[150px] min-w-full flex items-center justify-center z-0 "
                size={15}
                type="bounce"
              />
            )}
            {isEmpty(emojis) && !isLoading && (
              <p className=" capitalize text-sm text-neutral-300 min-h-[150px] min-w-full flex items-center justify-center z-0">
                no result...
              </p>
            )}
          </section>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default EmojisContainer;
