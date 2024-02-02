import useBookmarks from "@/hooks/useBookmarks";
import { isEmpty } from "lodash";
import React from "react";
import Loader from "../shared/Loader";
import TweetCard from "../cards/TweetCard";
import useCurrentUser from "@/hooks/useCurrentUser";

const BookmarksFeed = ({ userId }: { userId?: string }) => {
  const { isLoading, posts } = useBookmarks(userId);
  const { data: user } = useCurrentUser();
  if (!posts || isLoading) {
    return <Loader message="loading bookmarked tweets" />;
  }
  if (posts.length === 0) {
    return (
      <p className="min-w-full flex items-center justify-center min-h-[300px] text-neutral-300 text-sm capitalize">
        no bookmarked tweets...
      </p>
    );
  }
  return (
    <div className="flex flex-col items-start justify-start gap-0">
      {posts.map((post) => (
        <TweetCard post={post} key={post.id} userId={user.id} />
      ))}
    </div>
  );
};

export default BookmarksFeed;
