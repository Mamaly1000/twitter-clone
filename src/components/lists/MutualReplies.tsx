import React, { useCallback } from "react";
import Avatar from "../shared/Avatar";
import { formatString } from "../../libs/wordDetector";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { User } from "@prisma/client";
import { useLoginModal } from "@/hooks/useLoginModal";
import useLike from "@/hooks/useLike";
import { FiShare } from "react-icons/fi";
import { BiRepost } from "react-icons/bi";
import TweetActionBar from "../shared/TweetActionBar";

const MutualReplies = ({
  replies,
  currentUser,
}: {
  currentUser: User;
  replies: {
    user: {
      id: string;
      name: string | null;
      username: string | null;
    };
    post: {
      user: {
        name: string | null;
      };
      body: string;
      likedIds: string[];
      commentIds: string[];
    };
    id: string;
    createdAt: Date;
    body: string;
    postId: string;
  }[];
}) => {
  const router = useRouter();

  const { hasLiked, toggleLike } = useLike({
    postId: replies[0].postId,
    userId: currentUser.id,
  });

  const loginModal = useLoginModal();

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

      if (replies[0].postId) router.push(`/repost/${replies[0].postId}`);
    },
    [loginModal, currentUser]
  );

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
  return (
    <div className="min-w-full max-w-full flex items-center justify-start px-2 md:px-5 pb-2 md:pb-5 pt-2 gap-4 hover:bg-neutral-800 hover:bg-opacity-50">
      {replies.length === 1 && (
        <div className="min-w-full flex items-start justify-start gap-3">
          <div className="relative flex items-center justify-center ">
            <Avatar
              userId={replies[0].user.id}
              className="relative z-10 border-neutral-300 border-[1px] border-opacity-50"
            />
            <hr className="w-[2px] absolute -top-2 min-h-[20px] z-0 bg-neutral-300 bg-opacity-50 border-none transition-all" />
          </div>
          <div className="w-fit flex flex-col items-start justify-start gap-2 capitalize">
            <div className="w-fit flex flex-wrap items-center justify-start gap-[6px] ">
              <p className="text-zinc-300 text-[13px] font-bold leading-[14px]">
                {replies[0].user.name}
              </p>
              <span className=" text-zinc-500 text-[13px] font-normal leading-[14px] hidden sm:block">
                @{replies[0].user.username}
              </span>
              <span className="text-zinc-500 text-sm font-normal leading-[14px]">
                {format(replies[0].createdAt, "MMM/dd/yyyy")}
              </span>
            </div>
            <p
              className="w-[289px] text-zinc-300 text-sm font-normal leading-[17px]"
              dangerouslySetInnerHTML={{
                __html: formatString(replies[0].body),
              }}
            ></p>
            <TweetActionBar mutual postId={replies[0].postId} />
          </div>
        </div>
      )}
      {replies.length > 2 && (
        <div className="min-w-full flex items-center justify-start gap-[35px]">
          <div className="flex items-center justify-start min-w-[65px] md:min-w-[35px] min-h-[18px] relative  ">
            {replies.map((rep, i) => {
              return (
                <Avatar
                  key={rep.user.id}
                  userId={rep.user.id}
                  className={twMerge(
                    "min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px] h-[30px] w-[30px] absolute drop-shadow-2xl border-[1px] border-black",
                    i === 1 && `start-4 z-20`,
                    i === 2 && "start-8 z-30"
                  )}
                />
              );
            })}
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: formatString(
                `replied by @${replies[0].user.username}, @${
                  replies[1].user.username
                }${
                  replies.length - 2 > 0 &&
                  `, and ${replies.length - 2} ${
                    replies.length - 2 > 2 ? "others" : "more"
                  }`
                }`
              ),
            }}
            className="max-w-[55%] gap-[2px] sm:max-w-[60%] md:max-w-[70%] flex flex-wrap gap-y-1 items-start justify-start text-[#72767A] font-[400] leading-[13px] text-[13px]"
          ></p>
        </div>
      )}
    </div>
  );
};

export default MutualReplies;
