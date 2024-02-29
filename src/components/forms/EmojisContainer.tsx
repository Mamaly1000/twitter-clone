import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react"; 
import { debounce, isEmpty } from "lodash";
import useEmoji from "@/hooks/useEmoji";
import Loader from "../shared/Loader";
import { twMerge } from "tailwind-merge";
import SearchInput from "../inputs/SearchInput";
import Tabs from "../ui/Tabs";
import { emojiCategories } from "@/dummy/stickers";

const EmojisContainer = ({
  show,
  onChange,
}: {
  onChange: (val: string) => void;
  show: boolean;
}) => {
  const [hoveredCharacter, setHoveredCharacter] = useState<{
    character: string;
    unicodeName: string;
    codePoint: string;
  } | null>(null);
  const { emojis, setSearch, isLoading, setCategory, category } =
    useEmoji(show);
  const searchDebounce = debounce((val) => {
    setCategory(null);
    setSearch(val);
  }, 1000);

  useEffect(() => {
    if (!show) {
      setCategory(null);
      setSearch("");
      setHoveredCharacter(null);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-[110%] w-[300px] h-[300px] max-h-[300px] max-w-[300px] rounded-lg bg-black border-[1px] border-neutral-800 p-2  flex-col items-start justify-start gap-2  hidden md:flex"
        >
          <SearchInput
            className="sticky top-0 left-0 bg-black z-10"
            name="emoji-search"
            onChange={(e) => {
              searchDebounce(e.target.value);
            }}
            placeholder="search your emoji..."
          />
          <Tabs
            onSelect={(val) => {
              setCategory(val);
            }}
            options={emojiCategories.map((e) => ({
              label: e.character,
              value: e.slug,
            }))}
            className="min-w-full max-w-full overflow-visible min-h-fit  justify-start divide-x-[1px] divide-neutral-800"
            optionClassName="text-[20px] p-2"
            currentValue={{
              label: category?.label,
              value: category?.value,
            }}
          />
          <section className="min-w-full max-w-full flex max-h-[200px] overflow-auto flex-wrap items-center justify-center gap-1 relative z-0">
            {emojis?.slice(0, 50).map(
              (e, index) =>
                !["🫠", "🥲"].includes(e.character) && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index / 10 + 0.01 }}
                    key={e.codePoint}
                    className={twMerge(
                      "min-w-fit w-[40px] h-[40px] max-h-[40px] text-[20px] rounded-lg drop-shadow-2xl border-[1px] border-neutral-800 flex items-center justify-center "
                    )}
                    onClick={() => onChange(e.character)}
                    onPointerEnter={() => setHoveredCharacter(e)}
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
          <AnimatePresence>
            {hoveredCharacter && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-full max-w-full flex items-center justify-start overflow-hidden sticky z-10 bottom-0 left-0 p-2 border-t-[1px] border-neutral-800 bg-black min-h-[50px] max-h-[50px] gap-3 text-sm font-semibold capitalize"
              >
                <span className="text-[20px] w-10 h-10  flex items-center justify-center">
                  {hoveredCharacter.character}
                </span>
                <p className="text-sm capitalize text-wrap line-clamp-1">
                  {hoveredCharacter.unicodeName}
                </p>
              </motion.section>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default EmojisContainer;
