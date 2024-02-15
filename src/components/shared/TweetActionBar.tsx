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

const TweetActionBar = ({
  postId,
  className,
}: {
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
  );
};

export default TweetActionBar;
