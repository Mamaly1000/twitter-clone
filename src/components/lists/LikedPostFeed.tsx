import useLikedPosts from "@/hooks/useLikedPosts";
import React from "react";
import Loader from "../shared/Loader";
import TweetCard from "../cards/TweetCard";
import { Post } from "@prisma/client";

const LikedPostFeed = ({ id }: { id: string }) => {
  const { likedPost: posts, isLoading } = useLikedPosts(id);

  if (!posts || isLoading) {
    return <Loader message="Loading Tweets" />;
  }
  if (!!(posts.length === 0)) {
    return (
      <p className="min-w-full flex items-center justify-center min-h-[300px] text-neutral-300 text-sm capitalize">
        no tweets...
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start gap-0">
      {(posts as Post[]).map((post) => (
        <TweetCard post={post} key={post.id} userId={id} />
      ))}
    </div>
  );
};

export default LikedPostFeed;
