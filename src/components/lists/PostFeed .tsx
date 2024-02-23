import usePosts, { PostsType } from "@/hooks/usePosts";
import { Post } from "@prisma/client";
import React from "react";
import TweetCard from "../cards/TweetCard";
import Loader from "../shared/Loader";
import Pagination from "../shared/Pagination";

const PostFeed = ({ id, type }: { type?: PostsType; id?: string }) => {
  const { posts, isLoading } = usePosts({ id, type });

  if (!posts || isLoading) {
    return <Loader message="Loading Tweets" />;
  }
  if (posts?.length === 0) {
    <div className="text-neutral-600 text-center p-6 text-xl">No Tweets</div>;
  }
  return (
    <div className="flex flex-col items-start justify-start gap-0 min-w-full max-w-full">
      {(posts as Post[]).map((post) => (
        <TweetCard post={post} key={post.id} userId={id} />
      ))}
      <Pagination params={{ id, type }} />
    </div>
  );
};

export default PostFeed;
