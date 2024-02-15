import { useStatus } from "@/hooks/useStatus";
import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import MediaContainer from "./MediaContainer";
import TweetSidebar from "./TweetSidebar";
import Button from "../inputs/Button";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import DraggableComponentProps from "../ui/DragComponent";

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
        visible ? " bg-opacity-80 opacity-100" : "opacity-0"
      )}
    >
      <MediaContainer
        className={twMerge(
          " min-h-screen flex flex-col justify-center items-center relative z-10 transition-all duration-100",
          collapse
            ? "col-span-12 md:col-span-12 lg:col-span-12"
            : "col-span-12 lg:col-span-7 2xl:col-span-9"
        )}
        handleClose={handleClose}
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
