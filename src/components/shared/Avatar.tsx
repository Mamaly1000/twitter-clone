import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import placeholder from "../../../public/placeholder.png";
import useProfileImage from "@/hooks/useProfileImage";
import { AnimatePresence, motion } from "framer-motion";
import HoveredUserCard from "../cards/HoveredUserCard";
import { useHoverUser } from "@/hooks/useHoverUser";
import { debounce } from "lodash";
const Avatar = ({
  userId,
  isLarge = false,
  hasBorder = false,
  className,
  repost,
  isTweet,
  postId,
  isComment,
}: {
  isComment?: boolean;
  postId?: string;
  isTweet?: boolean;
  repost?: boolean;
  className?: string;
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
}) => {
  const { user } = useProfileImage(userId);
  const router = useRouter();
  const {
    onHover,
    id,
    postId: hoveredPostId,
    onLeave,
    isHovering,
    setHover,
  } = useHoverUser();
  const onClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      const url = `/users/${userId}`;
      router.push(url);
    },
    [router, userId]
  );
  const onDebounce = debounce((val) => {  
    onLeave();
    setHover(val);
  }, 2000);
  const OnCloseHoveredUserCard = useCallback(() => {
    if (!isHovering) {
      onDebounce(false);
    }
  }, [onDebounce, isHovering]);

  if (!user) return null;
  return (
    <>
      <motion.div
        onPointerEnter={(e) => {
          e.stopPropagation();
          if (isTweet) {
            onHover({ userId, postId: postId! });
            setHover(false);
          }
        }}
        onPointerLeave={OnCloseHoveredUserCard}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClick}
        className={twMerge(
          "rounded-full hover:opacity-90 transition-all cursor-pointer relative z-[1] ",
          hasBorder ? "border-4 border-black" : "",
          isLarge
            ? "min-h-32 min-w-32 max-h-32 max-w-32"
            : "w-[40px] h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] min-h-[40px] w- ",
          className,
          repost &&
            "min-w-[20px] max-h-[20px] min-h-[20px] max-w-[20px] border-[1px] border-black"
        )}
      >
        <Image
          fill
          src={user?.profileImage || placeholder.src}
          alt={user?.username || "profile image"}
          className="rounded-full object-cover"
        />
      </motion.div>

      <HoveredUserCard
        isUnique={
          !!(
            isTweet &&
            userId === id &&
            postId &&
            postId === hoveredPostId &&
            !isComment
          )
        }
        className="top-[45px] left-0"
      />
    </>
  );
};

export default Avatar;
