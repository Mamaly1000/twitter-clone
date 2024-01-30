import useReplies from "@/hooks/useReplies";
import { Post } from "@prisma/client";
import React from "react";
import TweetCard from "../cards/TweetCard";
import Loader from "../shared/Loader";

const RepliesFeed = ({ id }: { id?: string }) => {
  const { isLoading, replies } = useReplies(id);
  if (!replies || isLoading) {
    return <Loader message="Loading Replies" />;
  }
  if (replies?.length === 0) {
    <div className="text-neutral-600 text-center p-6 text-xl">No Replies</div>;
  }
  return (
    <section className="flex flex-col items-start justify-start gap-0 min-w-full">
      {(replies as Post[]).map((post) => (
        <TweetCard post={post} key={post.id} userId={id} />
      ))}
    </section>
  );
};

export default RepliesFeed;
