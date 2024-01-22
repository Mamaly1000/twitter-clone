import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { Post, Repost, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import Avatar from "../shared/Avatar";
import useLike from "@/hooks/useLike";
import { useRepostModal } from "@/hooks/useRepostModal";
import { BiRepost } from "react-icons/bi";
import { formatString } from "@/libs/wordDetector";

const TweetCard = ({
  post,
  userId,
}: {
  userId?: string;
  post: Post & {
    user?: any;
    comments?: any[];
    repost?: Repost & { user?: User };
  };
}) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const repostModal = useRepostModal();

  const { data: currentUser } = useCurrentUser();

  const { hasLiked, toggleLike } = useLike({ postId: post.id, userId });

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();
      router.push(`/users/${post.user.id}`);
    },
    [router, post.user.id]
  );

  const goToPost = useCallback(() => {
    router.push(`/posts/${post.id}`);
  }, [router, post.id]);

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
      if (!currentUser) {
        loginModal.onOpen();
      }

      if (post?.id) repostModal.onOpen(post?.id);
    },
    [repostModal, loginModal, currentUser]
  );

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const createdAt = useMemo(() => {
    if (!post?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(post.createdAt));
  }, [post.createdAt]);

  const repostCreatedAt = useMemo(() => {
    if (!post.repost || !post.repost.createdAt) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(post.repost.createdAt));
  }, [post.repost]);

  return (
    <div
      onClick={goToPost}
      className="min-w-full border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition-all group"
    >
      <div className="flex flex-row items-start gap-3">
        <Avatar userId={post.user.id} />
        <div>
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={goToUser}
              className="
            text-white 
            font-semibold 
            cursor-pointer 
            hover:underline text-nowrap
        "
            >
              {post.user.name}
            </p>
            <span
              onClick={goToUser}
              className="
            text-neutral-500
            cursor-pointer
            hover:underline
            hidden
            md:block text-nowrap
        "
            >
              @{post.user.username}
            </span>
            <span className="text-neutral-500 text-sm text-nowrap">
              {createdAt}
            </span>
          </div>
          <div className="text-white mt-1 flex flex-col items-start justify-start gap-3">
            <p
              dangerouslySetInnerHTML={{ __html: formatString(post.body) }}
            ></p>
            {!!post.repost && !!post.repost.user && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (post.repost?.postId) {
                    router.push(`/posts/${post.repost?.postId}`);
                  }
                }}
                className="min-w-full flex flex-col items-start justify-start p-2 rounded-md border-[1px] border-neutral-900  drop-shadow-2xl text-neutral-500 group-hover:border-white"
              >
                <div className="min-w-full flex items-center justify-start gap-2">
                  <Avatar userId={post.repost.userId} hasBorder />
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/users/${post.repost?.userId}`);
                    }}
                    className="text-white hover:underline"
                  >
                    {post.repost.user.name}
                  </p>
                  <p
                    className="text-neutral-500 cursor-pointer hover:underline hidden md:block  "
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/users/${post.repost?.userId}`);
                    }}
                  >
                    @{post.repost.user.username}
                  </p>
                </div>
                <p
                  dangerouslySetInnerHTML={{ __html: formatString(post.repost.body) }}
                  className="text-left min-w-full text-[13px] capitalize text-white"
                ></p>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-2 
            cursor-pointer 
            transition 
            hover:text-sky-500
        "
            >
              <AiOutlineMessage size={20} />
              <p>{post.comments?.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className="
            flex 
            flex-row 
            items-center 
            text-neutral-500 
            gap-2 
            cursor-pointer 
            transition 
            hover:text-red-500
        "
            >
              <LikeIcon color={hasLiked ? "red" : ""} size={20} />
              <p>{post.likedIds.length}</p>
            </div>
            <div
              onClick={onRepost}
              className="hover:text-sky-400 text-neutral-500 "
            >
              <BiRepost size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
