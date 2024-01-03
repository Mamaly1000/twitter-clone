import TweetCard from "@/components/cards/TweetCard";
import CreatePost from "@/components/forms/CreatePost";
import CommentFeed from "@/components/lists/CommentFeed";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import React from "react";

const PostPage = () => {
  const router = useRouter();
  const { post, isLoading } = usePost(router.query.post_id as string);
  if (!post || isLoading) {
    return <Loader message="Loading Tweet data" />;
  }
  return (
    <>
      <Header label="Tweet" displayArrow />
      <TweetCard post={post} />
      <CreatePost postId={post.id} isComment placeholder="Tweet your reply" />
      <CommentFeed comments={post?.comments} />
    </>
  );
};

export default PostPage;
