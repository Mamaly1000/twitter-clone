import useBookmark from "@/hooks/useBookmark";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLike from "@/hooks/useLike";
import { useLoginModal } from "@/hooks/useLoginModal";
import usePost from "@/hooks/usePost";
import { useStatus } from "@/hooks/useStatus";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaComment, FaRegComment } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import AnimatedButton from "../ui/AnimatedButton";
import { motion } from "framer-motion";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { RxBookmark, RxBookmarkFilled } from "react-icons/rx";
import { FiShare } from "react-icons/fi";
import SkeletonActionsBar from "../SkeletonCards/SkeletonActionsBar";
import { isEmpty } from "lodash";
import { useSelectedDropdown } from "@/hooks/useSelectDropdown";

const TweetActionBar = ({
  postId,
  className,
  small = false,
  isComment,
}: {
  isComment?: boolean;
  small?: boolean;
  postId?: string;
  className?: string;
}) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const statusModal = useStatus();

  const { postId: selectedDropdownPostId, onClose: onClosePostDropDown } =
    useSelectedDropdown();

  const { data: currentUser } = useCurrentUser();

  const { post, isLoading: postLoading } = usePost(postId);
  const { toggleBookmark, isBookmarked } = useBookmark(postId);
  const { hasLiked, toggleLike, likeLoading } = useLike({
    postId: post?.id,
  });

  const [likeCount, setLikeCount] = useState(post?.likedIds?.length || 0);

  const dropDownDisable = useMemo(() => {
    return !!(selectedDropdownPostId === post?.id);
  }, [selectedDropdownPostId, post?.id]);

  const onLike = useCallback(
    async (ev: any) => {
      ev.stopPropagation();
      if (dropDownDisable) {
        onClosePostDropDown();
      } else {
        if (!currentUser) {
          return loginModal.onOpen();
        }
        toggleLike().then((res) => {
          setLikeCount(res as number);
        });
      }
    },
    [loginModal, currentUser, toggleLike, dropDownDisable]
  );

  const onRepost = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (dropDownDisable) {
        onClosePostDropDown();
      } else {
        if (!currentUser || !post) {
          loginModal.onOpen();
        }
        if (post?.id) {
          statusModal.onClose();
          router.push(`/repost/${post.id}`);
        }
      }
    },
    [loginModal, currentUser, post, dropDownDisable]
  );

  useEffect(() => {
    if (post?.likedIds?.length !== 0 || post?.likedIds?.length !== undefined) {
      setLikeCount(post?.likedIds?.length || 0);
    }
  }, [post?.likedIds?.length]);

  return !postLoading && post ? (
    <>
      {!small && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          onClick={(e) => e.stopPropagation()}
          className={className}
        >
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              if (dropDownDisable) {
                onClosePostDropDown();
              } else {
                statusModal.onClose();
                router.push(`/reply/${post.id}`);
              }
            }}
            iconSize={20}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
            value={post.commentIds.length}
            icons={{ default: FaRegComment, active: FaComment }}
            isComment={isComment}
            large
          />
          <AnimatedButton
            value={post.likedIds.length}
            icons={{
              active: GoHeartFill,
              default: GoHeart,
            }}
            classNames={{
              active: "text-[#f91880]",
              default: "text-[#728291]",
            }}
            className={twMerge(
              "flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-[#f91880]"
            )}
            iconSize={20}
            isLoading={likeLoading}
            onClick={onLike}
            isActive={hasLiked}
            isComment={isComment}
            large
          />
          <AnimatedButton
            onClick={onRepost}
            icons={{ active: AiOutlineRetweet, default: AiOutlineRetweet }}
            value={post.repostIds.length}
            className={twMerge("hover:text-sky-400  ")}
            large
            iconSize={20}
            isComment={isComment}
          />
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              if (dropDownDisable) {
                onClosePostDropDown();
              } else {
                toggleBookmark();
              }
            }}
            large
            iconSize={20}
            className={twMerge("hover:text-sky-400  ")}
            icons={{
              active: RxBookmarkFilled,
              default: RxBookmark,
            }}
            classNames={{
              active: "text-sky-500",
              default: "text-[#728291]",
            }}
            value={post.bookmarkedIds.length}
            isComment={isComment}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (dropDownDisable) {
                onClosePostDropDown();
              } else {
                navigator.share({
                  title: post.user.name + " tweet; " + post.body,
                  url: `/posts/${post.id}`,
                });
              }
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <FiShare size={20} />
          </div>
        </motion.div>
      )}
      {small && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          className={twMerge(
            "flex flex-row items-center text-[15px] gap-5 sm:gap-10 text-[#728291]",
            isComment
              ? "min-w-full justify-evenly py-3 border-t-[1px] border-t-neutral-300 dark:border-t-neutral-800"
              : "justify-between md:justify-normal",
            className
          )}
        >
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              if (dropDownDisable) {
                onClosePostDropDown();
              } else {
                statusModal.onClose();
                router.push(`/reply/${post.id}`);
              }
            }}
            disable={dropDownDisable}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
            value={post.commentIds.length}
            icons={{ default: FaRegComment, active: FaComment }}
            isComment={isComment}
            iconSize={15}
            key={"reply-" + postId + post.commentIds.length}
          />
          <AnimatedButton
            value={likeCount}
            className={twMerge(
              "flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-[#f91880]"
            )}
            icons={{
              active: GoHeartFill,
              default: GoHeart,
            }}
            classNames={{
              active: "text-[#f91880]",
              default: "text-[#728291]",
            }}
            isLoading={likeLoading}
            onClick={onLike}
            isActive={hasLiked}
            isComment={isComment}
            iconSize={15}
            disable={dropDownDisable}
          />
          <AnimatedButton
            onClick={onRepost}
            icons={{ active: AiOutlineRetweet, default: AiOutlineRetweet }}
            value={post.repostIds.length}
            className={twMerge("hover:text-sky-400  ")}
            iconSize={15}
            disable={dropDownDisable}
            isComment={isComment}
          />
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              if (dropDownDisable) {
                onClosePostDropDown();
              } else {
                toggleBookmark();
              }
            }}
            iconSize={15}
            className={twMerge("hover:text-sky-400")}
            icons={{
              active: RxBookmarkFilled,
              default: RxBookmark,
            }}
            classNames={{
              active: "text-sky-500",
              default: "text-[#728291]",
            }}
            disable={dropDownDisable}
            isActive={isBookmarked}
            value={post.bookmarkedIds.length}
            isComment={isComment}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (dropDownDisable) {
                onClosePostDropDown();
              } else {
                navigator.share({
                  title: post.user.name + " tweet; " + post.body,
                  url: `/posts/${post.id}`,
                });
              }
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <FiShare size={15} />
          </div>
        </motion.div>
      )}
    </>
  ) : (
    <>
      {!small ? (
        <SkeletonActionsBar className={className} large />
      ) : (
        <SkeletonActionsBar />
      )}
    </>
  );
};

export default TweetActionBar;
