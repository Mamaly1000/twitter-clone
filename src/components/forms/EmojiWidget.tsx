import React, { useMemo, useState } from "react";
import Button from "../inputs/Button";
import { BsEmojiSunglasses } from "react-icons/bs";
import EmojisContainer from "./EmojisContainer";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const EmojiWidget = ({ onChange }: { onChange: (val: string) => void }) => {
  const { scrolled } = useScrollAnimation({ delay: 2000 });
  const [disPlayWidget, setDisplayWidget] = useState(false);
  useMemo(() => {
    if (scrolled) {
      setDisplayWidget(false);
    }
  }, [scrolled, setDisplayWidget]);
  return (
    <>
      <Button
        onClick={() => {
          setDisplayWidget((prev) => !prev);
        }}
        className="rounded-md min-w-10 min-h-10 flex items-center justify-center p-[1px]   "
      >
        <BsEmojiSunglasses className="text-white" />
      </Button>
      <EmojisContainer onChange={onChange} show={disPlayWidget} />
    </>
  );
};

export default EmojiWidget;
