import useBookmark from "@/hooks/useBookmark";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLike from "@/hooks/useLike";
import { useLoginModal } from "@/hooks/useLoginModal";
import usePost from "@/hooks/usePost";
import { useStatus } from "@/hooks/useStatus";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import AnimatedButton from "../ui/AnimatedButton";

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
  const { hasLiked, toggleLike } = useLike({
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

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
  if (postLoading || !post) {
    return null;
  }

  return (
    <>
      {!small && !mutual && (
        <div onClick={(e) => e.stopPropagation()} className={className}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              statusModal.onClose();
              router.push(`/reply/${post.id}`);
            }}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
          >
            <AiOutlineMessage size={20} />

            <p className="text-[20px]">{post.commentIds.length || 0}</p>
          </div>
          <div
            onClick={onLike}
            className="flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-red-500"
          >
            <LikeIcon color={hasLiked ? "red" : ""} size={20} />
            <p className="text-[20px]">{post.likedIds.length}</p>
          </div>
          <div onClick={onRepost} className={twMerge("hover:text-sky-400  ")}>
            <BiRepost size={25} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <BookmarkIcon size={20} />
          </div>
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
        </div>
      )}
      {small && (
        <div
          className={twMerge(
            "flex flex-row items-center text-[13px] gap-5 sm:gap-10 text-[#728291]",
            isComment
              ? "min-w-full justify-evenly py-3 border-t-[1px] border-t-neutral-800"
              : "justify-between md:justify-normal"
          )}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              statusModal.onClose();
              router.push(`/reply/${post.id}`);
            }}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
          >
            <AiOutlineMessage size={15} />
            {!isComment && (
              <p className="text-[12px]">{post.commentIds.length || 0}</p>
            )}
          </div>
          <AnimatedButton
            value={post.likedIds.length}
            Icon={LikeIcon}
            className={twMerge(
              "flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-red-500",
              hasLiked ? "text-red-600" : "text-[#728291]"
            )}
            isLoading={postLoading}
            onClick={onLike}
            isActive={hasLiked}
            isComment={isComment}
            key={post.likedIds.toString()}
          />
          <div onClick={onRepost} className={twMerge("hover:text-sky-400  ")}>
            <BiRepost size={15} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <BookmarkIcon />
          </div>
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
        </div>
      )}
      {mutual && (
        <div
          className={twMerge(
            "flex flex-row items-center text-[12px] gap-10 mt-1 text-[#687684]"
          )}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/reply/${post.id}`);
            }}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
          >
            <AiOutlineMessage size={15} />

            <p className="text-[12px]">{post.commentIds.length || 0}</p>
          </div>
          <div
            onClick={onLike}
            className="flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-red-500"
          >
            <LikeIcon color={hasLiked ? "red" : ""} size={15} />
            <p className="text-[12px]">{post.likedIds.length}</p>
          </div>
          <div onClick={onRepost} className={twMerge("hover:text-sky-400  ")}>
            <BiRepost size={15} />
          </div>{" "}
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
        </div>
      )}
    </>
  );
};

export default TweetActionBar;
