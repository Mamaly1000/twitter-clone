import React, { useState } from "react";
import Button from "../inputs/Button";
import { BsEmojiSunglasses } from "react-icons/bs";
import EmojisContainer from "./EmojisContainer";

const EmojiWidget = ({ onChange }: { onChange: (val: string) => void }) => {
  const [disPlayWidget, setDisplayWidget] = useState(false);

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
