import React from "react";
import LargeUserCard from "./LargeUserCard";
import { useHoverUser } from "@/hooks/useHoverUser";
import useUser from "@/hooks/useUser";
import UserFeedSkeletonCard from "../SkeletonCards/UserFeedSkeletonCard";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

const HoveredUserCard = ({
  className,
  isUnique,
}: {
  isUnique?: boolean;
  className?: string;
}) => {
  const { id, onLeave, postId, onHover, setHover, isHovering } = useHoverUser();
  const { user, isLoading } = useUser(id);

  return (
    <AnimatePresence>
      {!!id && !!postId && isUnique && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerEnter={(e) => {
            setHover(true); 
            e.stopPropagation();
            onHover({
              userId: id,
              postId,
            });
          }}
          onPointerLeave={() => {
            onLeave();
            setHover(false);
          }}
          className={twMerge(
            "max-w-fit max-h-fit absolute z-[9000] bg-black rounded-lg drop-shadow-2xl",
            className
          )}
        >
          {!isLoading && user ? (
            <LargeUserCard main user={user} />
          ) : (
            <UserFeedSkeletonCard main />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HoveredUserCard;
