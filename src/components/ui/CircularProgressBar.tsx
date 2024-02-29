import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CircularProgressBar = ({
  limit,
  currentValue,
  color,
  size = 30,
}: {
  limit: number;
  currentValue: number;
  color?: string;
  size?: number;
}) => {
  const [percentage, setPercentage] = useState(0);
  const [mainColor, setMainColor] = useState(color || "#1d9bf0");
  const fadedColor = "rgba(255 255 255/.3)";

  useEffect(() => {
    setPercentage(Math.floor((currentValue / limit) * 100));
    if (currentValue === limit) {
      setMainColor("#FE0020");
    } else {
      setMainColor(color || "#0EA5E9");
    }
  }, [limit, currentValue]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const circleVariants = {
    hidden: { strokeDashoffset: 440 },
    visible: {
      strokeDashoffset: (1 - percentage / 100) * 440,
      stroke: mainColor,
    },
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ width: size, height: size }}
    >
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        strokeWidth="10"
        stroke={fadedColor}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        strokeWidth="10"
        strokeDasharray="440"
        variants={circleVariants}
        initial="hidden"
        animate="visible"
      />
    </motion.svg>
  );
};

export default CircularProgressBar;
