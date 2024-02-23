import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedButton = ({
  onClick,
  Icon,
  value = 0,
  isActive,
  className,
  isComment,
  isLoading,
  iconSize,
  large,
}: {
  large?: boolean;
  iconSize?: number;
  isComment?: boolean;
  onClick?: (e: any) => void;
  Icon: IconType;
  value?: number;
  isActive?: boolean;
  className?: string;
  isLoading?: boolean;
}) => {
  const [currentValue] = useState(value);
  const [visibleCount, setVisibleCount] = useState(false);

  return (
    <motion.button
      className={twMerge(
        "w-10 h-10 max-w-10 relative max-h-10 rounded-lg text-[#728291] overflow-hidden flex items-center justify-center gap-2",
        className
      )}
      onClick={(e) => {
        setVisibleCount(true);
        onClick!(e);
      }}
      disabled={isLoading}
      animate={{
        scale: isLoading ? [0.9, 1, 0.9, 1, 0.9] : [1],
      }}
    >
      <Icon size={iconSize || 14} />
      {!isComment && (
        <div className="w-auto relative flex items-center justify-center">
          <motion.p
            initial={
              !visibleCount && currentValue === value
                ? {
                    translateY: 10,
                    opacity: 0,
                  }
                : {}
            }
            animate={
              !visibleCount && currentValue === value
                ? {
                    translateY: currentValue === value ? 0 : 20,
                    opacity: 100,
                  }
                : {
                    translateY: -50,
                    opacity: 0,
                  }
            }
            className={twMerge("text-[12px] absolute", large && "text-[20px]")}
          >
            {currentValue}
          </motion.p>

          <motion.p
            animate={
              visibleCount
                ? {
                    translateY: 0,
                    opacity: 100,
                  }
                : {
                    translateY: 20,
                    opacity: 0,
                  }
            }
            className={twMerge("text-[12px] absolute", large && "text-[20px]")}
          >
            {isActive ? (value === 0 ? 0 : value - 1) : value + 1}
          </motion.p>
        </div>
      )}
    </motion.button>
  );
};

export default AnimatedButton;
