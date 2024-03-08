import React from "react";
import LargeUserCard from "./LargeUserCard";
import { useHoverUser } from "@/hooks/useHoverUser";
import useUser from "@/hooks/useUser";
import UserFeedSkeletonCard from "../SkeletonCards/UserFeedSkeletonCard";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { DebouncedFunc } from "lodash";

const HoveredUserCard = ({
  className,
  isUnique,
  debounce,
}: {
  debounce: DebouncedFunc<(val: any) => void>;
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
            e.stopPropagation();
            debounce.cancel();
            setHover(true);
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
            <LargeUserCard
              mutuals={{
                mutualFollowers: user.mutualFollowers,
                mutualFollowersCount: user.mutualFollowersCount,
              }}
              main
              user={user}
            />
          ) : (
            <UserFeedSkeletonCard main />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HoveredUserCard;
