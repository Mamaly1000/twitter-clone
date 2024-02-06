import { Post } from "@prisma/client";
import React from "react";
import TweetCard from "../cards/TweetCard";
import { isEmpty } from "lodash";

const RawPostFeed = ({
  posts,
  title,
  userId,
}: {
  userId: string;
  posts: Post[];
  title?: string;
}) => {
  if (isEmpty(posts)) {
    return null;
  }
  return (
    <section className="min-w-full max-w-full text-[#d9d9d9] flex flex-col items-start justify-start gap-4 mt-3">
      {title && (
        <h2 className="min-w-full px-3 text-left text-[20px] font-bold capitalize">
          {title}
        </h2>
      )}
      <div className="flex flex-col items-start justify-start gap-0 min-w-full border-t-[1px] border-neutral-800">
        {posts.map((post) => (
          <TweetCard post={post} key={post.id} userId={userId} />
        ))}
      </div>
    </section>
  );
};

export default RawPostFeed;
