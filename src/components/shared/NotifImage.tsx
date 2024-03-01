import Image from "next/image";
import React from "react";

import tweet from "../../../public/images/icons8-send-96.png";
import mention from "../../../public/images/icons8-mention-64.png";
import { AiFillDislike, AiFillLike, AiOutlineRetweet } from "react-icons/ai";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import comment from "../../../public/images/icons8-chat-message-96.png";
import { MdBookmarks } from "react-icons/md";
export type notifTypes =
  | "UNFOLLOW"
  | "FOLLOW"
  | "DISLIKE"
  | "LIKE"
  | "REPOST"
  | "TWEET"
  | "MENTION"
  | "BOOKMARK"
  | "UNBOOKMARK"
  | "COMMENT";
const NotifImage = ({ type }: { type: notifTypes }) => {
  return (
    <div className=" w-[20px] h-[20px] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] md:w-[30px] md:h-[30px] md:min-w-[30px] md:min-h-[30px] md:max-w-[30px] md:max-h-[30px] relative overflow-hidden text-sky-600 flex items-center justify-center aspect-video">
      {type === "UNFOLLOW" && (
        <SlUserUnfollow className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-red-500" />
      )}
      {type === "FOLLOW" && (
        <SlUserFollow className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
      )}
      {type === "DISLIKE" && (
        <AiFillDislike className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-red-500" />
      )}
      {type === "LIKE" && (
        <AiFillLike className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
      )}
      {type === "REPOST" && (
        <AiOutlineRetweet className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
      )}
      {type === "TWEET" && (
        <Image className="object-cover" fill src={tweet.src} alt="tweet icon" />
      )}
      {type === "MENTION" && (
        <Image
          fill
          className="object-cover"
          src={mention.src}
          alt="tweet icon"
        />
      )}
      {type === "BOOKMARK" && (
        <MdBookmarks className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
      )}{" "}
      {type === "UNBOOKMARK" && (
        <MdBookmarks className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-red-500" />
      )}
      {type === "COMMENT" && (
        <Image
          fill
          className="object-cover"
          src={comment.src}
          alt="comment icon"
        />
      )}
    </div>
  );
};

export default NotifImage;
