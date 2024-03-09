import usePosts, { PostsType } from "@/hooks/usePosts";
import { Post } from "@prisma/client";
import React, { useMemo } from "react";
import TweetCard from "../cards/TweetCard";
import Loader from "../shared/Loader";
import Pagination from "../shared/Pagination";
import { twMerge } from "tailwind-merge";
import SkeletonTweetCard from "../SkeletonCards/SkeletonTweetCard";
import { isEmpty } from "lodash";
import Each from "../shared/Each";
import EmptyMessage from "../shared/EmptyMessage";

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

  const content = useMemo(() => {
    if (isEmpty(posts) && !isLoading) {
      return <EmptyMessage type="tweet">there is not tweets!</EmptyMessage>;
    }
    if (isEmpty(posts) && isLoading) {
      return (
        <div
          className={twMerge(
            "flex flex-col items-start justify-start gap-0 min-w-full max-w-full relative z-0",
            className
          )}
        >
          <Each
            of={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            render={(_irem, index) => <SkeletonTweetCard key={index} />}
          />
        </div>
      );
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
  }, [posts, isLoading]);

  return content;
};

export default PostFeed;
