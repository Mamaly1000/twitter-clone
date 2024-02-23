import { useScroll } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

const useScrollAnimation = ({ delay = 1000 }: { delay?: number }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const handleScroll = useCallback(() => {
    if (150 < scrollY.get()) {
      setScrolled(true);
    }
    if (150 > scrollY.get()) {
      setScrolled(false);
    }
  }, [scrollY, scrolled]);

  useEffect(() => {
    let scrollTimer: any;

    const handleScroll = () => {
      clearTimeout(scrollTimer);
      setIsScrolling(true);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, delay);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [delay]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return {
    scrolled,
    scrollY,
    isScrolling,
  };
};

export default useScrollAnimation;
