import useCurrentUser from "@/hooks/useCurrentUser";
import { Post, Repost, User } from "@prisma/client";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import Avatar from "@/components/shared/Avatar";
import { formatString, getStringDirectionality } from "@/libs/wordDetector";
import { LiaReplySolid } from "react-icons/lia";
import { twMerge } from "tailwind-merge";
import MutualReplies from "@/components/lists/MutualReplies";
import TweetImageList from "@/components/lists/TweetImageList";
import { useStatus } from "@/hooks/useStatus";
import TweetActionBar from "@/components/shared/TweetActionBar";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { getShortUnit } from "@/libs/utils";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import { useHoverUser } from "@/hooks/useHoverUser";
import DropDown, { DropDownItemType } from "@/components/ui/DropDown";
import { BiDotsHorizontal, BiShare } from "react-icons/bi";
import { useSelectedDropdown } from "@/hooks/useSelectDropdown";
import useFollow from "@/hooks/useFollow";
import { FiDelete } from "react-icons/fi";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";

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
  const {
    postId: selectedDropdownPostId,
    onSelect,
    onClose: onClosePostDropDown,
  } = useSelectedDropdown();

  const [ref, { height }] = useMeasure();
  const [mutualReplies, setMutuals] = useState(false);

  const router = useRouter();
  const statusModal = useStatus();

  const { data: currentUser } = useCurrentUser();
  const {
    isFollowing,
    toggleFollow,
    isLoading: followingLoading,
  } = useFollow(post?.userId);

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();
      if (selectedDropdownPostId === post?.id) {
        onClosePostDropDown();
      } else {
        statusModal.onClose();
        router.push(`/users/${post?.user.id}`);
      }
    },
    [router, post?.user.id, selectedDropdownPostId, onClosePostDropDown]
  );

  const goToPost = useCallback(() => {
    if (selectedDropdownPostId === post?.id) {
      onClosePostDropDown();
    } else {
      statusModal.onClose();
      router.push(`/posts/${post?.id}`);
    }
  }, [router, post?.id, selectedDropdownPostId, onClosePostDropDown]);

  const goToParentPost = useCallback(() => {
    if (selectedDropdownPostId === post?.id) {
      onClosePostDropDown();
    } else {
      if (post?.parentId) {
        statusModal.onClose();

        router.push(`/posts/${post?.parentId}`);
      }
    }
  }, [
    router,
    post?.parentId,
    statusModal,
    selectedDropdownPostId,
    onClosePostDropDown,
  ]);

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
  const onDropDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (selectedDropdownPostId !== post?.id && post?.id) {
        onSelect(post?.id);
      } else {
        onClosePostDropDown();
      }
    },
    [post?.id, selectedDropdownPostId, onClosePostDropDown, onSelect]
  );
  const DropDownOptions: DropDownItemType[] = useMemo(() => {
    return [
      !!(post?.userId === currentUser?.id)
        ? [
            {
              Icon: BiShare,
              label: "share tweet",
              onClick: () =>
                navigator.share({
                  title: post?.body,
                  url: `/posts/${post?.id}`,
                }),
            },
            {
              Icon: FiDelete,
              label: "delete tweet",
              onClick: () =>
                navigator.share({
                  title: post?.body,
                  url: `/posts/${post?.id}`,
                }),
              disabled: true,
            },
          ]
        : [
            {
              Icon: BiShare,
              label: "share tweet",
              onClick: () =>
                navigator.share({
                  title: post?.body,
                  url: `/posts/${post?.id}`,
                }),
            },
            {
              Icon: isFollowing ? SlUserUnfollow : SlUserFollow,
              label: isFollowing
                ? `unfollow @${post?.user?.username}`
                : `follow @${post?.user?.username}`,
              onClick: toggleFollow,
              disabled: followingLoading,
            },
          ],
    ].flat();
  }, [
    post?.userId,
    currentUser?.id,
    isFollowing,
    toggleFollow,
    followingLoading,
  ]);
  if (!post) {
    return null;
  }
  return (
    <article
      onClick={goToPost}
      className={twMerge(
        "min-w-full max-w-full border-b-[1px] border-neutral-300 dark:border-neutral-800  cursor-pointer  transition-all group flex items-center justify-center flex-col p-0 relative ",
        (hoveredUserId === post.userId &&
          post.id === hoveredPostId &&
          !isComment) ||
          selectedDropdownPostId === post.id
          ? "z-[100] "
          : "z-[1]",
        isComment && "overflow-hidden"
      )}
    >
      <div
        className={twMerge(
          "flex flex-col items-start justify-start min-w-full max-w-full dark:hover:bg-neutral-900 hover:bg-neutral-100 duration-300",
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
                ? "flex-row min-w-full max-w-full items-start justify-start gap-4"
                : "flex-col items-center justify-center gap-1"
            )}
          >
            <div className=" relative z-[1] flex items-center justify-center">
              <Avatar
                isTweet
                postId={post.id}
                className={twMerge(
                  " relative  border-[2px] border-opacity-50",
                  mutualReplies &&
                    !isComment &&
                    "dark:border-[#333639] border-neutral-300",
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
              <div className="min-w-[calc(100%-56px)] max-w-[calc(100%-56px)] relative capitalize flex items-center justify-between">
                <div className="max-w-[60%] line-clamp-1 text-nowrap whitespace-nowrap flex flex-col items-start justify-start ">
                  <p
                    onClick={goToUser}
                    className=" text-text-primary dark:text-[#d9d9d9] font-semibold cursor-pointer hover:underline text-nowrap  "
                  >
                    {post.user.name}
                  </p>
                  <span
                    onClick={goToUser}
                    className=" text-neutral-500 cursor-pointer hover:underline text-nowrap "
                  >
                    @{post.user.username}
                  </span>
                </div>
                <DropDown
                  onDropDown={onDropDown}
                  display={selectedDropdownPostId === post?.id}
                  onClose={onClosePostDropDown}
                  position="right-0 top-0 "
                  options={DropDownOptions}
                >
                  <BiDotsHorizontal />
                </DropDown>
              </div>
            )}
            {!!!isComment && mutualReplies && (
              <motion.hr
                className="z-0 w-[2px] bg-neutral-300 dark:bg-[#333639] border-none transition-all absolute top-0"
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
            {/* tweet header section when iscomment is false */}
            {!!!isComment && (
              <div
                className={twMerge(
                  " text-[15px] items-center justify-between gap-[6px] line-clamp-1 min-w-full max-w-full overflow-visible flex relative  flex-row",
                  selectedDropdownPostId === post?.id ? "z-[999]" : "z-10"
                )}
              >
                <div className="w-fit max-w-[85%] flex items-center flex-wrap justify-start gap-1">
                  <p
                    onClick={goToUser}
                    className="text-[15px] capitalize font-bold cursor-pointer hover:text-sky-500 text-nowrap text-text-primary dark:text-[#d9d9d9]"
                  >
                    {post.user.name}
                  </p>
                  <span
                    onClick={goToUser}
                    className="text-[#687684] cursor-pointer hover:underline hidden md:block text-nowrap "
                  >
                    @{post.user.username}
                  </span>
                  <span className="text-[#687684] text-nowrap">
                    {" "}
                    · {createdAt}
                  </span>
                </div>
                <DropDown
                  onDropDown={onDropDown}
                  display={selectedDropdownPostId === post?.id}
                  onClose={onClosePostDropDown}
                  position="right-0 top-0 "
                  options={DropDownOptions}
                >
                  <BiDotsHorizontal />
                </DropDown>
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
                      ? "text-lg capitalize min-w-full max-w-full text-text-primary dark:text-[#d9d9d9] " +
                          tweetdirection.className
                      : "text-[13px] sm:text-[17px] text-text-primary dark:text-[#d9d9d9] font-[400] leading-[24px] capitalize   text-wrap max-w-full min-w-full " +
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
                  className="overflow-hidden flex flex-row items-start justify-start p-2 rounded-md border-[1px] border-neutral-300 dark:border-neutral-800 drop-shadow-2xl text-[#687684] hover:border-neutral-400 dark:hover:border-neutral-600 mb-3 gap-3 min-w-full max-w-full "
                >
                  <Avatar repost userId={post.repost.userId} />
                  <div className=" max-w-[calc(100%-32px)] min-w-[calc(100%-32px)] flex items-start justify-start flex-col gap-2">
                    <div className="min-w-full max-w-full overflow-hidden line-clamp-1 flex items-center justify-start gap-1 text-[13px]">
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/users/${post.repost?.userId}`);
                        }}
                        className=" text-text-primary dark:text-[#d9d9d9] capitalize font-bold hover:text-sky-500 max-w-[95%] overflow-hidden text-wrap whitespace-pre-wrap"
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
                          "max-w-full min-w-full text-[14px] leading-[-.2px] capitalize font-light text-text-primary dark:text-[#D9D9D9] whitespace-pre-wrap overflow-hidden line-clamp-3 md:line-clamp-4 text-balance",
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
              <div className="min-w-full flex items-center justify-start gap-2 text-sm text-neutral-500 capitalize border-t-[1px] border-t-neutral-300 dark:border-t-neutral-800 py-3">
                <span className="flex items-center justify-center gap-1">
                  <AnimatedNumber
                    key={post.id + post.repostIds.toString()}
                    className="dark:text-white text-black"
                  >
                    {post.repostIds.length || 0}
                  </AnimatedNumber>
                  retweets
                </span>
                <span className="flex items-center justify-center gap-1">
                  <AnimatedNumber
                    key={"comment-" + post.id + post.commentIds.toString()}
                    className="dark:text-white text-black"
                  >
                    {post.commentIds.length || 0}
                  </AnimatedNumber>
                  comments
                </span>
              </div>
            )}
            {isComment && (
              <div className="min-w-full flex items-center justify-start gap-2 text-sm text-neutral-500 capitalize border-t-[1px] border-t-neutral-300 dark:border-t-neutral-800 py-3">
                <span className="flex items-center justify-center gap-1">
                  <AnimatedNumber
                    key={post.id + post.likedIds.toString()}
                    className="dark:text-white text-black"
                  >
                    {post.likedIds.length || 0}
                  </AnimatedNumber>
                  likes
                </span>{" "}
                <span className="flex items-center justify-center gap-1">
                  <AnimatedNumber
                    key={post.id + post.bookmarkedIds.toString()}
                    className="dark:text-white text-black"
                  >
                    {post.bookmarkedIds.length || 0}
                  </AnimatedNumber>
                  bookmarks
                </span>
              </div>
            )}
            <TweetActionBar
              className={twMerge(
                selectedDropdownPostId === post?.id ? "z-0" : ""
              )}
              isComment={isComment}
              small
              postId={post.id}
            />
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
