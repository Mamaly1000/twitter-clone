import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { PanInfo, motion } from "framer-motion";

interface DraggableComponentProps {
  children?: ReactNode;
  className?: string;
  onDragEnd?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  children,
  className,
  onDragEnd,
}) => {
  return (
    <motion.div
      drag="y"
      transition={{
        ease: "linear",
        delay: 0,
        duration: 0.1,
        power: 0,
        velocity: 0,
      }}
      dragConstraints={{
        top: 10,
        bottom: 10,
      }}
      onDragEnd={onDragEnd}
      dragSnapToOrigin
      dragElastic={1}
      className={twMerge("w-auto h-auto relative", className)}
    >
      {children}
    </motion.div>
  );
};

export default DraggableComponent;
