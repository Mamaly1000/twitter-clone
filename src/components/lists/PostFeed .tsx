import usePosts, { PostsType } from "@/hooks/usePosts";
import { Post } from "@prisma/client";
import React from "react";
import TweetCard from "../cards/TweetCard";
import Loader from "../shared/Loader";
import Pagination from "../shared/Pagination";
import { twMerge } from "tailwind-merge";

const PostFeed = ({
  id,
  type,
  hashtagId,
  className,
}: {
  className?: string;
  hashtagId?: string;
  type?: PostsType;
  id?: string;
}) => {
  const { posts, isLoading } = usePosts({ id, type, hashtagId });

  if (!posts || isLoading) {
    return <Loader message="Loading Tweets" />;
  }
  if (posts?.length === 0) {
    <div className="text-neutral-600 text-center p-6 text-xl">No Tweets</div>;
  }
  return (
    <div
      className={twMerge(
        "flex flex-col items-start justify-start gap-0 min-w-full max-w-full relative z-0",
        className
      )}
    >
      {(posts as Post[]).map((post) => (
        <TweetCard post={post} key={post.id} userId={id} />
      ))}
      <Pagination params={{ id, type }} />
    </div>
  );
};

export default PostFeed;
