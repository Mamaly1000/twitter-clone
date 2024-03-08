import { Comment, Post, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import Avatar from "../shared/Avatar";
import { twMerge } from "tailwind-merge";
import { BiDotsVertical } from "react-icons/bi";
import { formatString, getStringDirectionality } from "@/libs/wordDetector";
import TweetImageList from "../lists/TweetImageList";
import TweetActionBar from "../shared/TweetActionBar";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { getShortUnit } from "@/libs/utils";

const CommentCard = ({
  comment,
  i,
  lastIndex,
  userId,
  postAuthor,
}: {
  postId: string;
  postAuthor: string;
  userId: string;
  lastIndex: number;
  i: number;
  comment: Comment & { user?: any; post: Post & { user: User } };
}) => {
  const router = useRouter();

  const [ref, { height }] = useMeasure();

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();

      router.push(`/users/${comment.user.id}`);
    },
    [router, comment.user.id]
  );

  const createdAt = useMemo(() => {
    if (!comment?.createdAt) {
      return null;
    }
    const cd = formatDistanceToNowStrict(new Date(comment.createdAt)).split(
      " "
    );
    return cd[0] + getShortUnit(cd[1]);
  }, [comment.createdAt]);

  const direction = useMemo(() => {
    return getStringDirectionality(comment?.body);
  }, [comment.body]);

  return (
    <div
      className={twMerge(
        `min-w-full px-5  cursor-pointer hover:bg-neutral-900 transition-all max-w-full`,
        i === 0 ? "pt-4 pb-1" : "py-1",
        lastIndex === i && "pb-3"
      )}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/posts/${comment.postId}`);
      }}
    >
      <div className="flex flex-row items-start gap-3">
        <div className="w-fit flex items-center justify-start flex-col relative ">
          <Avatar
            isTweet
            postId={comment.id}
            userId={comment.user.id}
            className="relative z-[2]"
          />
          <div className="absolute flex flex-col items-center justify-center gap-1 z-[1]">
            <motion.hr
              className="w-[1.8px] rounded-md bg-neutral-300 bg-opacity-30 border-none transition-all  z-10"
              animate={{ height: lastIndex === i ? height - 20 : height }}
            />
            {lastIndex === i && (
              <span className="flex flex-col text-neutral-300 text-opacity-50 text-lg gap-1 ">
                <BiDotsVertical />
              </span>
            )}
          </div>
        </div>
        <div
          ref={ref}
          className="min-w-[calc(100%-52px)] max-w-[calc(100%-52px)] max-h-fit"
        >
          <div className="flex flex-col  items-start justify-start min-w-full max-w-full">
            <div className="  flex  items-center justify-start gap-1 min-w-full max-w-full">
              <p
                onClick={goToUser}
                className="
                  text-white 
                  font-semibold 
                  cursor-pointer 
                  hover:underline
              "
              >
                {comment.user.name}
              </p>
              <span
                onClick={goToUser}
                className="
                  text-neutral-500
                  cursor-pointer
                  hover:underline
                  hidden
                  md:block
              "
              >
                @{comment.user.username}
              </span>
              <span className="text-neutral-500 text-sm">{createdAt}</span>
            </div>
            {!!(comment.userId !== userId) && (
              <p
                className="text-neutral-400 capitalize"
                dangerouslySetInnerHTML={{
                  __html: formatString(`replying to @${postAuthor}`),
                }}
              ></p>
            )}
          </div>
          {!!comment.body && (
            <p
              style={{
                direction: direction.dir,
              }}
              dangerouslySetInnerHTML={{ __html: formatString(comment.body) }}
              className={twMerge(
                "text-[#e7e9ea] text-[15px]  my-2 leading-[20px] font-[400] capitalize ",
                direction.className
              )}
            ></p>
          )}
          <TweetImageList postId={comment.postId} />
          <TweetActionBar
            className="min-w-full max-w-full"
            small
            postId={comment.postId}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
