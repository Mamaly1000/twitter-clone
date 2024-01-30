import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { Post, Repost, User } from "@prisma/client";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import Avatar from "../shared/Avatar";
import useLike from "@/hooks/useLike";
import { useRepostModal } from "@/hooks/useRepostModal";
import { BiRepost } from "react-icons/bi";
import { formatString } from "@/libs/wordDetector";
import { LiaReplySolid } from "react-icons/lia";
import { twMerge } from "tailwind-merge";
import { includes } from "lodash";
import { FiShare } from "react-icons/fi";

const TweetCard = ({
  post,
  userId,
  isComment = false,
}: {
  isComment?: boolean;
  userId?: string;
  post: Post & {
    user?: any;
    comments?: any[];
    repost?: Repost & { user?: User; post: Post };
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

  const goToParentPost = useCallback(() => {
    if (post.parentId) {
      router.push(`/posts/${post.parentId}`);
    }
  }, [router, post.parentId]);

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

  const isReposted = useMemo(() => {
    const list = [...(post.repostIds || [])];
    return includes(list, userId);
  }, [post.repostIds, userId]);

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const createdAt = useMemo(() => {
    if (!post?.createdAt) {
      return null;
    }
    if (isComment) {
      return format(post.createdAt, "HH:mm . dd/MM/yy");
    }

    return formatDistanceToNowStrict(new Date(post.createdAt));
  }, [post.createdAt]);

  const repostCreateAt = useMemo(() => {
    if (!post!.repost?.post?.createdAt || !post?.repost) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(post.repost.post.createdAt));
  }, [post?.repost?.post?.createdAt]);

  return (
    <article
      onClick={goToPost}
      className={twMerge(
        "min-w-full border-b-[1px] border-neutral-800  cursor-pointer hover:bg-neutral-900 transition-all group flex items-center justify-center flex-col gap-1",
        isComment ? "p-0" : "p-5"
      )}
    >
      <div
        className={twMerge(
          "flex flex-col items-start justify-start min-w-full",
          isComment ? "px-5 pt-5  gap-4" : " "
        )}
      >
        {post.parentId && post.parentUsername && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              goToParentPost();
            }}
            className={twMerge(
              "min-w-fit flex items-center justify-start text-[#687684]",
              isComment ? "ms-10 capitalize" : "ms-10"
            )}
          >
            <LiaReplySolid
              className="peer-hover:scale-110"
              size={isComment ? 15 : 12}
            />
            <p
              className={twMerge(
                "min-w-fit p-2 hover:text-sky-500",
                "text-[14px]"
              )}
              dangerouslySetInnerHTML={{
                __html: formatString(`replied to the @${post.parentUsername}`),
              }}
            ></p>
          </div>
        )}
        <div
          className={twMerge(
            "min-w-full flex items-start justify-start gap-3",
            isComment ? "flex-col" : "flex-row"
          )}
        >
          <div className="flex items-start justify-start gap-4">
            <Avatar
              className="w-[55px] h-[55px] min-w-[55px] max-h-[55px] max-w-[55px] min-h-[55px] "
              userId={post.user.id}
            />
            {!!isComment && (
              <div className="flex flex-col items-start justify-start capitalize">
                <p
                  onClick={goToUser}
                  className=" text-white font-semibold cursor-pointer hover:underline text-nowrap  "
                >
                  {post.user.name}
                </p>
                <span
                  onClick={goToUser}
                  className=" text-neutral-500 cursor-pointer hover:underline text-nowrap "
                >
                  @{post.user.username}
                </span>
                {!!!isComment && (
                  <span className="text-neutral-500 text-sm text-nowrap">
                    {createdAt}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={twMerge(isComment?"w-full":"w-auto")}>
            {!!!isComment && (
              <div className="flex flex-row text-[16px] items-center gap-[6px]">
                <p
                  onClick={goToUser}
                  className=" text-white capitalize font-bold cursor-pointer hover:text-sky-500 text-nowrap "
                >
                  {post.user.name}
                </p>
                <span
                  onClick={goToUser}
                  className="
            text-[#687684]
            cursor-pointer
            hover:underline
            hidden
            md:block text-nowrap
        "
                >
                  @{post.user.username}
                </span>
                {!!!isComment && (
                  <span className="text-[#687684] text-nowrap">
                    {" "}
                    · {createdAt}
                  </span>
                )}
              </div>
            )}
            <div
              className={twMerge(
                "text-[#D9D9D9] flex flex-col items-start justify-start gap-3 w-full",
                isComment ? "mt-4 mb-3" : "mt-1"
              )}
            >
              <p
                className={twMerge(
                  isComment
                    ? "text-lg capitalize"
                    : "text-[16px] text-inherit font-light leading-[-.3px] capitalize",
                  post.repostId ? "" : "mb-3"
                )}
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
                  className="min-w-full max-w-full overflow-hidden flex flex-row items-start justify-start p-2 rounded-md border-[1px] border-neutral-900  drop-shadow-2xl text-[#687684] hover:border-neutral-600 mb-3 gap-3"
                >
                  <Avatar
                    className="min-w-[40px] max-h-[40px] min-h-[40px] max-w-[40px]"
                    userId={post.repost.userId}
                    hasBorder
                  />
                  <div className="min-w-full flex items-start justify-start flex-col gap-2">
                    <div className="min-w-full max-w-full overflow-hidden line-clamp-1 flex items-center justify-start gap-1 text-[13px]">
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/users/${post.repost?.userId}`);
                        }}
                        className="text-white capitalize font-bold hover:text-sky-500"
                      >
                        {post.repost.user.name}
                      </p>
                      <p
                        className=" cursor-pointer hover:underline hidden md:block  "
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/users/${post.repost?.userId}`);
                        }}
                      >
                        @{post.repost.user.username}
                      </p>
                      <span className=" ">{repostCreateAt}</span>
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: formatString(post.repost.body),
                      }}
                      className="text-[13px] leading-[-.3px] capitalize text-[#D9D9D9]"
                    ></p>
                  </div>
                </div>
              )}
              {isComment && (
                <span className="min-w-full text-neutral-500   text-nowrap">
                  {createdAt}
                </span>
              )}
            </div>
            {isComment && (
              <div className="min-w-full flex items-center justify-start gap-2 text-sm text-neutral-500 capitalize border-t-[1px] border-t-neutral-800 py-3">
                <span className="flex items-center justify-center gap-1">
                  <span className="text-white">
                    {post.repostIds.length || 0}
                  </span>
                  retweets
                </span>
                <span className="flex items-center justify-center gap-1">
                  <span className="text-white">
                    {post.commentIds.length || 0}
                  </span>
                  comments
                </span>
                <span className="flex items-center justify-center gap-1">
                  <span className="text-white">
                    {post.likedIds.length || 0}
                  </span>
                  likes
                </span>
              </div>
            )}
            <div
              className={twMerge(
                "flex flex-row items-center gap-10 text-[#687684]",
                isComment
                  ? "min-w-full justify-evenly py-3 border-t-[1px] border-t-neutral-800"
                  : ""
              )}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/reply/${post.id}`);
                }}
                className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
              >
                <AiOutlineMessage size={20} />
                {!isComment && <p>{post.commentIds.length || 0}</p>}
              </div>
              <div
                onClick={onLike}
                className="flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-red-500"
              >
                <LikeIcon color={hasLiked ? "red" : ""} size={20} />
                {!isComment && <p>{post.likedIds.length}</p>}
              </div>
              <div
                onClick={onRepost}
                className={twMerge("hover:text-sky-400  ")}
              >
                <BiRepost size={20} />
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
                <FiShare size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TweetCard;
