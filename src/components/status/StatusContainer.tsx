import { useStatus } from "@/hooks/useStatus";
import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import MediaSlider from "./MediaSlider";
import TweetSidebar from "./TweetSidebar";
import Button from "../inputs/Button";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const StatusContainer = () => {
  const { isOpen, postId, onClose } = useStatus();
  const [collapse, setCollapse] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 251);
  }, [setVisible, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className={twMerge(
        "min-w-full fixed top-0 left-0 min-h-screen max-h-screen max-w-full grid grid-cols-12 z-50 bg-black  text-[#d9d9d9] ",
        visible ? " bg-opacity-60 opacity-100" : "opacity-0"
      )}
    >
      <div className="w-fit flex items-center justify-start gap-3 absolute top-3 left-3 z-30">
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
            setCollapse((prev) => !prev);
          }}
        >
          <MdOutlineKeyboardDoubleArrowRight size={15} className="text-white" />
        </Button>
      </div>
      <MediaSlider
        collapse={collapse}
        setCollapse={(val) => setCollapse(val)}
        postId={postId}
      />
      <TweetSidebar
        collapse={collapse}
        setCollapse={(val) => setCollapse(val)}
        postId={postId}
      />
    </section>
  );
};

export default StatusContainer;
