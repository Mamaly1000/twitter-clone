"use client"
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { ReactNode, useMemo } from "react";
import unAuthorizedImage from "../../../public/images/unauthorized-image.png";
import HashtagImage from "../../../public/images/hashtagImage.svg";
import tweetImage from "../../../public/images/tweetImage.svg";
import usersImage from "../../../public/images/usersImage.svg";
import notificationImage from "../../../public/images/notificationImage.svg";
import commentsImage from "../../../public/images/commentsImage.svg";
import hashtagSearchImage from "../../../public/images/hashtagSearchImage.svg";
import usersSearchImage from "../../../public/images/usersSearchImage.svg";
import Image from "next/image";
const EmptyMessage = ({
  children,
  type,
}: {
  type?:
    | "hashtag"
    | "tweet"
    | "notification"
    | "comment"
    | "users"
    | "user-search"
    | "hashtag-search";
  children?: ReactNode;
}) => {
  const { data: user } = useCurrentUser();
  const EmptyImage = useMemo(() => {
    if (type === "hashtag") {
      return HashtagImage.src as string;
    }
    if (type === "tweet") {
      return tweetImage.src as string;
    }
    if (type === "users") {
      return usersImage.src as string;
    }
    if (type === "notification") {
      return notificationImage.src as string;
    }
    if (type === "comment") {
      return commentsImage.src as string;
    }
    if (type === "user-search") {
      return usersSearchImage.src as string;
    }
    if (type === "hashtag-search") {
      return hashtagSearchImage.src as string;
    }

    return tweetImage.src as string;
  }, [type]);
  if (!user) {
    return (
      <p className="text-sm p-3 capitalize text-neutral-500 dark:text-neutral-300 min-w-full text-center min-h-[150px] flex flex-col items-center justify-center ">
        <Image
          src={unAuthorizedImage.src}
          width={200}
          height={200}
          alt="unAuthorizedImage"
        />
        you are unAuthorized! please login to your account.
      </p>
    );
  }
  return (
    user && (
      <p className="text-sm capitalize p-4 text-neutral-500 dark:text-neutral-300 min-w-full text-center min-h-[150px] flex flex-col items-center justify-center">
        <Image
          src={EmptyImage}
          width={200}
          height={200}
          alt="unAuthorizedImage"
        />
        {children}
      </p>
    )
  );
};

export default EmptyMessage;
