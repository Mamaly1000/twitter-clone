import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const ScrollHideShowComponent = ({
  children,
  className,
  targetElement,
  target,
}: {
  target: { className: string };
  targetElement?: ReactNode;
  className?: string;
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentScroll, setScroll] = useState(0);
  const scrollHandler = () => {
    setScroll(window.scrollY);
    if (currentScroll < window.scrollY) {
      setIsVisible(false);
    }
    if (currentScroll > window.scrollY) {
      setIsVisible(true);
    }
  };
  const autoOpen = debounce(() => {
    if (!isVisible && currentScroll === window.scrollY) {
      setIsVisible(true);
    }
  }, 1000);
  useEffect(() => {
    autoOpen();
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      autoOpen.cancel();
    };
  }, [isVisible, currentScroll, setScroll, setIsVisible]);
 

  return (
    <div className={twMerge("min-w-full max-w-full", className)}>
      {children}
      <div
        className={twMerge(
          "transition-all p-0 m-0 ",
          !isVisible ? "translate-y-[200px]" : "translate-y-0",
          target.className
        )}
      >
        {targetElement}
      </div>
    </div>
  );
};

export default ScrollHideShowComponent;
