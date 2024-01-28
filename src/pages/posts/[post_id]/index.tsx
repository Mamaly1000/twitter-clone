import TweetCard from "@/components/cards/TweetCard";
import CommentFeed from "@/components/lists/CommentFeed";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import React from "react";

const PostPage = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { post, isLoading } = usePost(router.query.post_id as string);
  if (!post || isLoading || !user) {
    return <Loader message="Loading Tweet data" />;
  }
  return (
    <>
      <Header label="Tweet" displayArrow />
      <TweetCard isComment post={post} />
      <CommentFeed
        postId={post.id}
        author={post.user.username}
        comments={post?.comments}
        userId={user.id}
      />
    </>
  );
};

export default PostPage;
