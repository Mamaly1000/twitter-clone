import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const AnimatedButton = ({
  onClick,
  value = 0,
  isActive,
  className,
  isComment,
  isLoading,
  iconSize,
  large,
  icons,
  classNames,
}: {
  icons: {
    active: IconType;
    default: IconType;
  };
  classNames?: {
    active?: string;
    default?: string;
  };
  large?: boolean;
  iconSize?: number;
  isComment?: boolean;
  onClick?: (e: any) => void;
  value?: number;
  isActive?: boolean;
  className?: string;
  isLoading?: boolean;
}) => {
  const { active: ActiveIcon, default: DefaultIcon } = icons;
  const [clicked, setClicked] = useState(false);
  const [actived, setActive] = useState(isActive);
  const [initCount, setInitCount] = useState(value);
  const [activedCount, setActivedCount] = useState(
    isActive ? (value - 1 < 0 ? 0 : value - 1) : value + 1
  );
  const toggleLike = (e: any) => {
    e.stopPropagation();
    setClicked(!clicked);
    setActive(!actived);
    setActivedCount(
      clicked
        ? actived
          ? value + 1
          : value - 1
        : actived
        ? value - 1 < 0
          ? 0
          : value - 1
        : value + 1
    );

    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (!clicked) setInitCount(value);
  }, [value]);

  useEffect(() => {
    if (isComment) {
      setActive(isActive);
    }
  }, [isActive]);

  return (
    <motion.button
      className={twMerge(
        "w-10 h-10 max-w-10 relative max-h-10 rounded-lg text-[#728291] overflow-hidden flex items-center justify-center gap-2",
        className
      )}
      onClick={toggleLike}
      disabled={isLoading}
    >
      {actived ? (
        <motion.span
          animate={{
            scale: actived ? [0.9, 3, 0.5, 2, 0.9, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <ActiveIcon
            className={twMerge(classNames?.active)}
            size={iconSize || 14}
          />
        </motion.span>
      ) : (
        <DefaultIcon
          className={twMerge(classNames?.default)}
          size={iconSize || 14}
        />
      )}
      {!isComment && (
        <div
          className={twMerge(
            "w-auto flex items-center justify-center text-[13px] relative z-10",
            actived ? classNames?.active : classNames?.default
          )}
        >
          <motion.p
            initial={{
              opacity: 0,
              translateY: 25,
            }}
            className="absolute z-0"
            animate={
              clicked
                ? initCount > activedCount
                  ? {
                      opacity: 0,
                      translateY: -25,
                    }
                  : {
                      opacity: 0,
                      translateY: 25,
                    }
                : {
                    opacity: 1,
                    translateY: 0,
                  }
            }
            transition={{
              duration: 0.12,
              ease: "linear",
            }}
          >
            {initCount}
          </motion.p>
          <motion.p
            initial={
              initCount > activedCount
                ? {
                    opacity: 0,
                    translateY: 25,
                  }
                : {
                    opacity: 0,
                    translateY: -25,
                  }
            }
            transition={{
              duration: 0.12,
              ease: "linear",
            }}
            animate={
              clicked
                ? {
                    opacity: 1,
                    translateY: 0,
                  }
                : initCount > activedCount
                ? {
                    opacity: 0,
                    translateY: 25,
                  }
                : {
                    opacity: 0,
                    translateY: -25,
                  }
            }
          >
            {activedCount}
          </motion.p>
        </div>
      )}
    </motion.button>
  );
};

export default AnimatedButton;
