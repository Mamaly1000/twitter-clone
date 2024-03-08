import useCurrentUser from "@/hooks/useCurrentUser";
import { Post, Repost, User } from "@prisma/client";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import Avatar from "../shared/Avatar";
import { formatString, getStringDirectionality } from "@/libs/wordDetector";
import { LiaReplySolid } from "react-icons/lia";
import { twMerge } from "tailwind-merge";
import MutualReplies from "../lists/MutualReplies";
import TweetImageList from "../lists/TweetImageList";
import { useStatus } from "@/hooks/useStatus";
import TweetActionBar from "../shared/TweetActionBar";
import AnimatedNumber from "../ui/AnimatedNumber";
import { getShortUnit } from "@/libs/utils";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import { useHoverUser } from "@/hooks/useHoverUser";

const TweetCard = ({
  post,
  isComment = false,
  status,
}: {
  status?: boolean;
  isComment?: boolean;
  userId?: string;
  post?:
    | (Post & {
        user?: any;
        repost?: Repost & { user?: User; post: Post };
      })
    | null;
}) => {
  const { id: hoveredUserId, postId: hoveredPostId } = useHoverUser();

  const [ref, { height }] = useMeasure();
  const [mutualReplies, setMutuals] = useState(false);

  const router = useRouter();
  const statusModal = useStatus();

  const { data: currentUser } = useCurrentUser();

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();
      statusModal.onClose();
      router.push(`/users/${post?.user.id}`);
    },
    [router, post?.user.id]
  );

  const goToPost = useCallback(() => {
    statusModal.onClose();
    router.push(`/posts/${post?.id}`);
  }, [router, post?.id]);

  const goToParentPost = useCallback(() => {
    if (post?.parentId) {
      statusModal.onClose();
      router.push(`/posts/${post?.parentId}`);
    }
  }, [router, post?.parentId]);

  const createdAt = useMemo(() => {
    if (!post?.createdAt) {
      return null;
    }
    if (isComment) {
      return format(post?.createdAt, "HH:mm . dd/MM/yy");
    }
    const cd = formatDistanceToNowStrict(new Date(post?.createdAt)).split(" ");
    return cd[0] + "" + getShortUnit(cd[1]);
  }, [post?.createdAt]);

  const repostCreateAt = useMemo(() => {
    if (!post?.repost?.post?.createdAt || !post?.repost) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(post?.repost?.post?.createdAt));
  }, [post?.repost?.post?.createdAt]);

  const tweetdirection = useMemo(() => {
    return getStringDirectionality(post?.body || "");
  }, [post?.body]);
  const reTweetdirection = useMemo(() => {
    return getStringDirectionality(post?.repost?.body || "");
  }, [post?.repost?.body]);
  if (!post) {
    return null;
  }
  return (
    <article
      onClick={goToPost}
      className={twMerge(
        "min-w-full max-w-full border-b-[1px] border-neutral-800  cursor-pointer  transition-all group flex items-center justify-center flex-col p-0 relative ",
        hoveredUserId === post.userId && post.id === hoveredPostId && !isComment
          ? "z-[900] "
          : "z-[1]",
        isComment && "overflow-hidden"
      )}
    >
      <div
        className={twMerge(
          "flex flex-col items-start justify-start min-w-full max-w-full hover:bg-neutral-900",
          isComment ? "px-5 pt-5  gap-4" : " p-2 ",
          !isComment && mutualReplies ? "pb-0" : "pb-0"
        )}
      >
        {/* tweet parent post reference */}
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
        {/* main tweet container */}
        <div
          className={twMerge(
            "min-w-full max-w-full flex items-start justify-start gap-3",
            isComment ? "flex-col" : "flex-row"
          )}
        >
          {/* tweet avatar section */}
          <div
            className={twMerge(
              "flex relative z-10",
              isComment
                ? "flex-row items-start justify-start gap-4"
                : "flex-col items-center justify-center gap-1"
            )}
          >
            <div className=" relative z-[1] flex items-center justify-center">
              <Avatar
                isTweet
                postId={post.id}
                className={twMerge(
                  " relative  border-[2px] border-opacity-50",
                  mutualReplies && !isComment && "border-[#333639]",
                  isComment &&
                    !!post.parentId &&
                    "relative z-10 border-[#333639] border-[2px]  "
                )}
                isComment={isComment}
                hasBorder
                userId={post.user.id}
              />
              {isComment && !!post.parentId && (
                <hr className="w-[2px] absolute  bottom-2 min-h-[200px] z-0 bg-neutral-300 bg-opacity-50 border-none transition-all" />
              )}
            </div>
            {!!isComment && (
              <div className="flex flex-col items-start justify-start capitalize">
                <p
                  onClick={goToUser}
                  className=" text-[#d9d9d9] font-semibold cursor-pointer hover:underline text-nowrap  "
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
            {!!!isComment && mutualReplies && (
              <motion.hr
                className="z-0 w-[2px] bg-[#333639] border-none transition-all absolute top-0"
                animate={{ height }}
              />
            )}
          </div>
          {/* main tweet content section */}
          <div
            ref={ref}
            className={twMerge(
              "max-h-fit relative z-0",
              isComment
                ? "w-full max-w-full "
                : " min-w-[calc(100%-52px)] max-w-[calc(100%-52px)]"
            )}
          >
            {!!!isComment && (
              <div className="flex flex-wrap text-[15px] items-center gap-[6px] line-clamp-1 min-w-full max-w-full">
                <p
                  onClick={goToUser}
                  className="text-[15px] capitalize font-bold cursor-pointer hover:text-sky-500 text-nowrap text-[#d9d9d9]"
                >
                  {post.user.name}
                </p>
                <span
                  onClick={goToUser}
                  className="text-[#687684] cursor-pointer hover:underline hidden md:block text-nowrap "
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
            {/* tweet body and repost section */}
            <div
              className={twMerge(
                "text-[#D9D9D9] flex flex-col items-start justify-start gap-3 min-w-full max-w-full",
                isComment ? "mt-4 mb-3" : "mt-1"
              )}
            >
              {!!post.body && (
                <p
                  className={twMerge(
                    isComment
                      ? "text-lg capitalize min-w-full max-w-full" +
                          tweetdirection.className
                      : "text-[13px] sm:text-[17px] text-[#e7e9ea] font-[400] leading-[24px] capitalize   text-wrap overflow-hidden max-w-full min-w-full " +
                          tweetdirection.className,
                    post.repostId ? "" : "mb-3",
                    !isComment && "line-clamp-4 md:line-clamp-5"
                  )}
                  style={{
                    direction: tweetdirection.dir,
                  }}
                  dangerouslySetInnerHTML={{ __html: formatString(post.body) }}
                ></p>
              )}
              {!!!status && (
                <TweetImageList
                  hasMedia={!!(post?.mediaIds.length > 0)}
                  postId={post.id}
                />
              )}
              {/* repost-container */}
              {!!post.repost && !!post.repost.user && !!post.repostId && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (post.repost?.postId) {
                      router.push(`/posts/${post.repost?.postId}`);
                    }
                  }}
                  className="overflow-hidden flex flex-row items-start justify-start p-2 rounded-md border-[1px] border-neutral-800 drop-shadow-2xl text-[#687684] hover:border-neutral-600 mb-3 gap-3 min-w-full max-w-full "
                >
                  <Avatar repost userId={post.repost.userId} />
                  <div className=" max-w-[calc(100%-32px)] min-w-[calc(100%-32px)] flex items-start justify-start flex-col gap-2">
                    <div className="min-w-full max-w-full overflow-hidden line-clamp-1 flex items-center justify-start gap-1 text-[13px]">
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/users/${post.repost?.userId}`);
                        }}
                        className="text-[#d9d9d9] capitalize font-bold hover:text-sky-500 max-w-[95%] overflow-hidden text-wrap whitespace-pre-wrap"
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
                    {!!post.repost.body && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: formatString(post.repost.body),
                        }}
                        style={{
                          direction: reTweetdirection.dir,
                        }}
                        className={twMerge(
                          "max-w-full min-w-full text-[14px] leading-[-.2px] capitalize font-light text-[#D9D9D9] whitespace-pre-wrap overflow-hidden line-clamp-3 md:line-clamp-4 text-balance",
                          reTweetdirection.className
                        )}
                      ></p>
                    )}
                    <TweetImageList
                      hasMedia
                      className="max-w-full min-w-full"
                      postId={post.repost.postId}
                    />
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
                  <AnimatedNumber
                    key={post.id + post.repostIds.toString()}
                    className="text-white"
                  >
                    {post.repostIds.length || 0}
                  </AnimatedNumber>
                  retweets
                </span>
                <span className="flex items-center justify-center gap-1">
                  <AnimatedNumber
                    key={"comment-" + post.id + post.commentIds.toString()}
                    className="text-white"
                  >
                    {post.commentIds.length || 0}
                  </AnimatedNumber>
                  comments
                </span>
              </div>
            )}
            {isComment && (
              <div className="min-w-full flex items-center justify-start gap-2 text-sm text-neutral-500 capitalize border-t-[1px] border-t-neutral-800 py-3">
                <span className="flex items-center justify-center gap-1">
                  <AnimatedNumber
                    key={post.id + post.likedIds.toString()}
                    className="text-white"
                  >
                    {post.likedIds.length || 0}
                  </AnimatedNumber>
                  likes
                </span>{" "}
                <span className="flex items-center justify-center gap-1">
                  <AnimatedNumber
                    key={post.id + post.bookmarkedIds.toString()}
                    className="text-white"
                  >
                    {post.bookmarkedIds.length || 0}
                  </AnimatedNumber>
                  bookmarks
                </span>
              </div>
            )}
            <TweetActionBar isComment={isComment} small postId={post.id} />
          </div>
        </div>
      </div>
      {/* mutual replies */}
      {!isComment && (
        <MutualReplies
          setMutual={(val) => {
            setMutuals(val);
          }}
          postId={post.id}
          currentUser={currentUser}
        />
      )}
    </article>
  );
};

export default TweetCard;
