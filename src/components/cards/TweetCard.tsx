import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import { Post, Repost, User } from "@prisma/client";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import Avatar from "../shared/Avatar";
import useLike from "@/hooks/useLike";
import { BiRepost } from "react-icons/bi";
import { formatString } from "@/libs/wordDetector";
import { LiaReplySolid } from "react-icons/lia";
import { twMerge } from "tailwind-merge";
import { filter, intersection, isEmpty } from "lodash";
import { FiShare } from "react-icons/fi";
import MutualReplies from "../lists/MutualReplies";
import useBookmark from "@/hooks/useBookmark";
import TweetImageList from "../lists/TweetImageList";

const TweetCard = ({
  post,
  userId,
  isComment = false,
}: {
  isComment?: boolean;
  userId?: string;
  post: Post & {
    user?: any;
    repost?: Repost & { user?: User; post: Post };
  };
}) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const [scrollHeight, setHeight] = useState(20);
  const tweetRef: React.LegacyRef<HTMLDivElement> | undefined = useRef(null);

  const { data: currentUser } = useCurrentUser();
  const { toggleBookmark, BookmarkIcon } = useBookmark(post.id);

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
      if (!currentUser || !post) {
        loginModal.onOpen();
      }

      if (post?.id) router.push(`/repost/${post.id}`);
    },
    [loginModal, currentUser, post]
  );

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

  useEffect(() => {
    const handleResize = () => {
      if (tweetRef) {
        setHeight(tweetRef.current!.offsetHeight);
      }
    };
    if (tweetRef) {
      setHeight(tweetRef.current!.offsetHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollHeight, window, tweetRef]);

  const mutualReplies = useMemo(() => {
    if (!post.commentIds || !currentUser) {
      return null;
    }
    const list = intersection(
      post.commentIds,
      currentUser.mutualReplies.map((u) => u.id)
    );
    return list.length > 0
      ? filter(currentUser.mutualReplies, (rep) =>
          post.commentIds.includes(rep.id)
        )
      : [];
  }, [post.commentIds, currentUser?.followingIds]);

  return (
    <article
      onClick={goToPost}
      className={twMerge(
        "min-w-full border-b-[1px] border-neutral-800  cursor-pointer hover:bg-neutral-900 transition-all group flex items-center justify-center flex-col p-0 "
      )}
    >
      <div
        className={twMerge(
          "flex flex-col items-start justify-start min-w-full",
          isComment ? "px-5 pt-5  gap-4" : " pt-5 px-5",
          !isComment && isEmpty(mutualReplies) ? "pb-5" : "pb-0"
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
          <div
            className={twMerge(
              "flex ",
              isComment
                ? "flex-row items-start justify-start gap-4"
                : "flex-col items-center justify-center gap-1"
            )}
          >
            <Avatar
              className={twMerge(
                "   border-[2px] border-opacity-50",
                !isEmpty(mutualReplies) && !isComment && "border-neutral-300"
              )}
              hasBorder
              userId={post.user.id}
            />
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
            {!!!isComment && !isEmpty(mutualReplies) && (
              <hr
                className="w-[2px]   bg-neutral-300 bg-opacity-50 border-none transition-all"
                style={{ minHeight: scrollHeight - 20 }}
              />
            )}
          </div>
          <div
            ref={tweetRef}
            className={twMerge(isComment ? "w-full" : "w-auto max-h-fit")}
          >
            {!!!isComment && (
              <div className="flex flex-wrap text-[16px] items-center gap-[6px] line-clamp-1 ">
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
                    : "text-[13px] sm:text-[14px] text-inherit font-light leading-[-.3px] capitalize max-w-[80%] md:max-w-[70%]",
                  post.repostId ? "" : "mb-3"
                )}
                dangerouslySetInnerHTML={{ __html: formatString(post.body) }}
              ></p>
              <TweetImageList postId={post.id} />
              {!!post.repost && !!post.repost.user && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (post.repost?.postId) {
                      router.push(`/posts/${post.repost?.postId}`);
                    }
                  }}
                  className="min-w-full max-w-full overflow-hidden flex flex-row items-start justify-start p-2 rounded-md border-[1px] border-neutral-800  drop-shadow-2xl text-[#687684]  hover:border-neutral-600 mb-3 gap-3"
                >
                  <Avatar
                    className="min-w-[35px] max-h-[35px] min-h-[35px] max-w-[35px] border-[1px] border-black"
                    userId={post.repost.userId}
                  />
                  <div className="min-w-full flex items-start justify-start flex-col gap-2">
                    <div className="min-w-full max-w-full overflow-hidden line-clamp-1 flex items-center justify-start gap-1 text-[13px]">
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/users/${post.repost?.userId}`);
                        }}
                        className="text-[#d9d9d9] capitalize font-bold hover:text-sky-500"
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
                      className="text-[13px] sm:text-[14px]  leading-[-.3px] capitalize font-light text-[#D9D9D9] max-w-[80%] md:max-w-[70%]"
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
              </div>
            )}
            {isComment && (
              <div className="min-w-full flex items-center justify-start gap-2 text-sm text-neutral-500 capitalize border-t-[1px] border-t-neutral-800 py-3">
                <span className="flex items-center justify-center gap-1">
                  <span className="text-white">
                    {post.likedIds.length || 0}
                  </span>
                  likes
                </span>{" "}
                <span className="flex items-center justify-center gap-1">
                  <span className="text-white">
                    {post.bookmarkedIds.length || 0}
                  </span>
                  bookmarks
                </span>
              </div>
            )}
            <div
              className={twMerge(
                "flex flex-row items-center text-[13px] gap-5 sm:gap-10 text-[#687684]",
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
                <AiOutlineMessage size={15} />
                {!isComment && (
                  <p className="text-[12px]">{post.commentIds.length || 0}</p>
                )}
              </div>
              <div
                onClick={onLike}
                className="flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-red-500"
              >
                <LikeIcon color={hasLiked ? "red" : ""} size={15} />
                {!isComment && (
                  <p className="text-[12px]">{post.likedIds.length}</p>
                )}
              </div>
              <div
                onClick={onRepost}
                className={twMerge("hover:text-sky-400  ")}
              >
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
          </div>
        </div>
      </div>
      {!isComment && !isEmpty(mutualReplies) && (
        <MutualReplies
          replies={mutualReplies || []}
          currentUser={currentUser}
        />
      )}
    </article>
  );
};

export default TweetCard;
