import React from "react";
import { twMerge } from "tailwind-merge";
import TweetActionBar from "../shared/TweetActionBar";
import MediaSlider from "./MediaSlider";
import Button from "../inputs/Button";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import DraggableComponent from "../ui/DragComponent";

const MediaContainer = ({
  postId,
  collapse,
  setCollapse,
  handleClose,
  className,
}: {
  className?: string;
  handleClose: () => void;
  postId?: string;
  collapse: boolean;
  setCollapse: (val: boolean) => void;
}) => {
  return (
    <div className={className}>
      <div className="w-full flex items-center justify-between gap-3 absolute top-3 z-30 px-3">
        <Button
          className="w-10 h-10 rounded-lg max-w-10 flex items-center justify-center p-1 dark:text-white text-text-primary"
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
          <MdOutlineKeyboardDoubleArrowRight size={15} className="dark:text-white text-text-primary" />
        </Button>
      </div>
      <div className="w-full flex items-center justify-center flex-col  h-full  relative">
        <MediaSlider
          handleClose={handleClose}
          className="min-w-[100%] max-w-[100%] md:min-w-[70%] md:max-w-[70%] max-h-[50vh] md:max-h-[60vh]"
          postId={postId}
        />
        {!!postId && (
          <TweetActionBar
            postId={postId}
            className={twMerge(
              "min-w-[100%] max-w-[100%] md:min-w-[70%] md:max-w-[70%] flex flex-row justify-between items-center p-6 bg-light dark:bg-black fixed md:relative bottom-0 left-0 z-30 text-[20px] gap-5 sm:gap-10 text-[#728291]"
            )}
          />
        )}
      </div>
    </div>
  );
};

export default MediaContainer;
