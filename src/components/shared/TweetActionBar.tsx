import useBookmark from "@/hooks/useBookmark";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLike from "@/hooks/useLike";
import { useLoginModal } from "@/hooks/useLoginModal";
import usePost from "@/hooks/usePost";
import { useStatus } from "@/hooks/useStatus";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import AnimatedButton from "../ui/AnimatedButton";
import { motion } from "framer-motion";
import { GoHeart, GoHeartFill } from "react-icons/go";

const TweetActionBar = ({
  postId,
  className,
  small = false,
  isComment,
  mutual = false,
}: {
  mutual?: boolean;
  isComment?: boolean;
  small?: boolean;
  postId?: string;
  className?: string;
}) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const statusModal = useStatus();

  const { data: currentUser } = useCurrentUser();

  const { post, isLoading: postLoading } = usePost(postId);
  const { toggleBookmark, BookmarkIcon } = useBookmark(postId);
  const { hasLiked, toggleLike, likeLoading } = useLike({
    postId: post?.id,
  });
  const onLike = useCallback(
    async (ev: any) => {
      ev.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      toggleLike();
    },
    [loginModal, currentUser, toggleLike]
  );

  const onRepost = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!currentUser || !post) {
        loginModal.onOpen();
      }

      if (post?.id) {
        statusModal.onClose();
        router.push(`/repost/${post.id}`);
      }
    },
    [loginModal, currentUser, post]
  );

  const LikeIcon = hasLiked ? GoHeartFill : GoHeart;
  if (postLoading || !post) {
    return null;
  }

  return (
    <>
      {!small && !mutual && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          onClick={(e) => e.stopPropagation()}
          className={className}
        >
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              statusModal.onClose();
              router.push(`/reply/${post.id}`);
            }}
            iconSize={20}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
            value={post.commentIds.length}
            Icon={FaRegComment}
            isComment={isComment}
            key={"reply-" + postId + post.commentIds.length}
            large
          />
          <AnimatedButton
            value={post.likedIds.length}
            Icon={LikeIcon}
            className={twMerge(
              "flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-[#f91880]",
              hasLiked || likeLoading ? "text-[#f91880]" : "text-[#728291]"
            )}
            iconSize={20}
            isLoading={likeLoading}
            onClick={onLike}
            isActive={hasLiked}
            isComment={isComment}
            key={"like-" + postId + post.likedIds.length}
            large
          />
          <AnimatedButton
            onClick={onRepost}
            Icon={AiOutlineRetweet}
            value={post.repostIds.length}
            className={twMerge("hover:text-sky-400  ")}
            large
            iconSize={20}
            isComment={isComment}
          />
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            large
            iconSize={20}
            className={twMerge("hover:text-sky-400  ")}
            Icon={BookmarkIcon}
            value={post.bookmarkedIds.length}
            isComment={isComment}
            key={"bookmark-" + postId + post.bookmarkedIds.length}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigator.share({
                title: post.user.name + " tweet; " + post.body,
                url: `/posts/${post.id}`,
              });
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
              ? "min-w-full justify-evenly py-3 border-t-[1px] border-t-neutral-800"
              : "justify-between md:justify-normal",
            className
          )}
        >
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              statusModal.onClose();
              router.push(`/reply/${post.id}`);
            }}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
            value={post.commentIds.length}
            Icon={FaRegComment}
            isComment={isComment}
            iconSize={15}
            key={"reply-" + postId + post.commentIds.length}
          />
          <AnimatedButton
            value={post.likedIds.length}
            Icon={LikeIcon}
            className={twMerge(
              "flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-[#f91880]",
              hasLiked || likeLoading ? "text-[#f91880]" : "text-[#728291]"
            )}
            isLoading={likeLoading}
            onClick={onLike}
            isActive={hasLiked}
            isComment={isComment}
            iconSize={15}
            key={"like-" + postId + post.likedIds.length}
          />
          <AnimatedButton
            onClick={onRepost}
            Icon={AiOutlineRetweet}
            value={post.repostIds.length}
            className={twMerge("hover:text-sky-400  ")}
            iconSize={15}
            isComment={isComment}
          />
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            iconSize={15}
            className={twMerge("hover:text-sky-400  ")}
            Icon={BookmarkIcon}
            value={post.bookmarkedIds.length}
            isComment={isComment}
            key={"bookmark-" + postId + post.bookmarkedIds.length}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigator.share({
                title: post.user.name + " tweet; " + post.body,
                url: `/posts/${post.id}`,
              });
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <FiShare size={15} />
          </div>
        </motion.div>
      )}
      {mutual && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          className={twMerge(
            "flex flex-row items-center text-[12px] gap-10 mt-1 text-[#687684]"
          )}
        >
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              statusModal.onClose();
              router.push(`/reply/${post.id}`);
            }}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
            value={post.commentIds.length}
            Icon={FaRegComment}
            isComment={isComment}
            key={"reply-" + postId + post.commentIds.length}
          />

          <AnimatedButton
            value={post.likedIds.length}
            Icon={LikeIcon}
            className={twMerge(
              "flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-[#f91880]",
              hasLiked || likeLoading ? "text-[#f91880]" : "text-[#728291]"
            )}
            isLoading={likeLoading}
            onClick={onLike}
            isActive={hasLiked}
            isComment={isComment}
            key={"like-" + postId + post.likedIds.length}
          />
          <AnimatedButton
            onClick={onRepost}
            Icon={AiOutlineRetweet}
            value={post.repostIds.length}
            className={twMerge("hover:text-sky-400  ")}
            isComment={isComment}
          />
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            className={twMerge("hover:text-sky-400  ")}
            Icon={BookmarkIcon}
            value={post.bookmarkedIds.length}
            isComment={isComment}
            key={"bookmark-" + postId + post.bookmarkedIds.length}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigator.share({
                title: post.user.name + " tweet; " + post.body,
                url: `/posts/${post.id}`,
              });
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <FiShare size={15} />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default TweetActionBar;
