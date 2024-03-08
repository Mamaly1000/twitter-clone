import React, { useCallback, useEffect, useMemo } from "react";
import Avatar from "../shared/Avatar";
import { formatString, getStringDirectionality } from "../../libs/wordDetector";
import { formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";
import { User } from "@prisma/client";
import TweetActionBar from "../shared/TweetActionBar";
import { getShortUnit } from "@/libs/utils";
import TweetImageList from "./TweetImageList";
import useMutualReplies from "@/hooks/useMutualReplies";

const MutualReplies = ({
  postId,
  setMutual,
}: {
  setMutual?: (val: boolean) => void;
  postId?: string;
  currentUser: User;
}) => {
  const { mutualReplies, isLoading, error } = useMutualReplies(postId);

  const createdAt = useMemo(() => {
    if (!mutualReplies || mutualReplies.length === 0) {
      return null;
    }

    if (!mutualReplies[0]?.createdAt) {
      return null;
    }
    const cd = formatDistanceToNowStrict(
      new Date(mutualReplies[0].createdAt)
    ).split(" ");
    return cd[0] + "" + getShortUnit(cd[1]);
  }, [mutualReplies]);
  const tweetdirection = useCallback((body: string) => {
    return getStringDirectionality(body || "");
  }, []);
  useEffect(() => {
    if (mutualReplies && mutualReplies.length > 0 && setMutual) {
      setMutual!(true);
    }
  }, [mutualReplies, setMutual]);
  if (error || isLoading || !mutualReplies || mutualReplies.length === 0) {
    return null;
  }
  return (
    <div className="min-w-full max-w-full flex items-center justify-start px-2 pb-0 pt-3 gap-4 hover:bg-neutral-800 hover:bg-opacity-50">
      {mutualReplies.length === 1 && (
        <div className="min-w-full max-w-full flex items-start justify-start gap-3">
          <div className="relative flex items-center justify-center ">
            <Avatar
              userId={mutualReplies[0].user.id}
              className="relative z-10 border-[#333639] border-[1px] border-opacity-50"
              isTweet
              postId={mutualReplies[0]?.id}
            />
            <hr className="w-[2px] absolute -top-[43px] rounded-full min-h-[40px] z-0 bg-[#333639] border-none transition-all" />
          </div>
          <div className="min-w-[calc(100%-52px)] max-w-[calc(100%-52px)] flex flex-col items-start justify-start gap-2 capitalize">
            <div className=" flex flex-wrap items-center justify-start gap-[6px] min-w-full max-w-full">
              <p className="text-[#e7e9ea] text-[15px] font-bold leading-[14px]">
                {mutualReplies[0].user.name}
              </p>
              <span className=" text-[#717678] text-[15px] font-normal leading-[14px] hidden sm:block">
                @{mutualReplies[0].user.username}
              </span>
              <span className="text-zinc-500 text-sm font-normal leading-[14px]">
                {createdAt}
              </span>
            </div>
            {mutualReplies[0].body ? (
              <p
                className={twMerge(
                  "w-[289px] text-zinc-300 text-sm font-normal leading-[17px] min-w-full max-w-full",
                  tweetdirection(mutualReplies[0].body).className
                )}
                style={{
                  direction: tweetdirection(mutualReplies[0].body).dir,
                }}
                dangerouslySetInnerHTML={{
                  __html: formatString(mutualReplies[0].body),
                }}
              ></p>
            ) : (
              <TweetImageList
                className="min-w-full max-w-full"
                postId={mutualReplies[0].id}
              />
            )}
            <TweetActionBar
              className="min-w-full max-w-full"
              small
              postId={mutualReplies[0].id}
            />
          </div>
        </div>
      )}
      {mutualReplies.length > 2 && (
        <div className="min-w-full flex items-center justify-start gap-[35px] pb-5">
          <div className="flex items-center justify-start min-w-[65px] md:min-w-[35px] min-h-[18px] relative  ">
            {mutualReplies.map((rep, i: number) => {
              return (
                <Avatar
                  key={rep?.user.id}
                  userId={rep?.user.id}
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
                `replied by @${mutualReplies[0].user.username}, @${
                  mutualReplies[1].user.username
                }${
                  mutualReplies.length - 2 > 0 &&
                  `, and ${mutualReplies.length - 2} ${
                    mutualReplies.length - 2 > 2 ? "others" : "more"
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
