import React, { useState } from "react";
import Button from "../inputs/Button";
import { BsEmojiSmile } from "react-icons/bs";
import EmojisContainer from "./EmojisContainer";

const EmojiWidget = ({ onChange }: { onChange: (val: string) => void }) => {
  const [disPlayWidget, setDisplayWidget] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setDisplayWidget((prev) => !prev);
        }}
        secondary
        className="min-w-[34px] min-h-[34px] max-w-[34px] max-h-[34px] p-[1px] rounded-full border-none hover:bg-sky-500 hover:bg-opacity-30 hidden md:flex items-center justify-center"
      >
        <BsEmojiSmile size={22} className="text-sky-500" />
      </Button>
      <EmojisContainer
        onClose={() => setDisplayWidget(false)}
        onChange={onChange}
        show={disPlayWidget}
      />
    </>
  );
};

export default EmojiWidget;
