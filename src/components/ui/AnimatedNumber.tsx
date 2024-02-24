import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const AnimatedNumber = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <motion.span
      initial={{
        opacity: 0,
        translateY: 20,
      }}
      animate={{
        opacity: 100,
        translateY: 0,
      }}
      transition={{
        bounce: [0, 4],
      }}
      className={twMerge("text-white", className)}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedNumber;
