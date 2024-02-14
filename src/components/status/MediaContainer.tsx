import React from "react";
import { twMerge } from "tailwind-merge";
import TweetActionBar from "../shared/TweetActionBar";
import MediaSlider from "./MediaSlider";
import Button from "../inputs/Button";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const MediaContainer = ({
  postId,
  collapse,
  setCollapse,
  handleClose,
}: {
  handleClose: () => void;
  postId?: string;
  collapse: boolean;
  setCollapse: (val: boolean) => void;
}) => {
  return (
    <div
      className={twMerge(
        " min-h-screen flex flex-col justify-center items-center relative z-10 transition-all duration-100",
        collapse
          ? "col-span-12 md:col-span-12 lg:col-span-12"
          : "col-span-12 lg:col-span-7 2xl:col-span-9"
      )}
    >
      <div className="w-full flex items-center justify-between gap-3 absolute top-3 z-30 px-3">
        <Button
          className="w-10 h-10 rounded-lg max-w-10 flex items-center justify-center p-1"
          secondary
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <IoClose />
        </Button>
        <Button
          className={twMerge(
            "w-10 max-w-10 h-10 rounded-lg flex justify-center items-center p-1 ",
            collapse ? "rotate-180" : ""
          )}
          secondary
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          <MdOutlineKeyboardDoubleArrowRight size={15} className="text-white" />
        </Button>
      </div>
      <MediaSlider postId={postId} />
      {!!postId && (
        <TweetActionBar
          postId={postId}
          className={twMerge(
            "min-w-[100%] max-w-[100%] md:min-w-[70%] md:max-w-[70%] flex flex-row justify-between items-center p-6 bg-black fixed md:static bottom-0 left-0 z-30 text-[20px] gap-5 sm:gap-10 text-[#728291]"
          )}
        />
      )}
    </div>
  );
};

export default MediaContainer;
