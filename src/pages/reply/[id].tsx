import TweetCard from "@/components/cards/TweetCard";
import CreatePost from "@/components/forms/CreatePost";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePost from "@/hooks/usePost";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";

const ReplyPage = () => {
  const router = useRouter();
  const postId = router.query.id as string;
  const { data: user } = useCurrentUser();
  const { post } = usePost(postId);
  if (!post || !user || !postId) {
    return <Loader message="post is not available" />;
  }
  return (
    <>
      <Header label="reply to a tweet" displayArrow />
      <TweetCard post={post} isComment userId={(user as User).id} />
      <CreatePost
        params={{ type: "comment", postId: post.id }}
        isComment
        postId={post.id}
        mainPage
        placeholder="tweet your reply"
      />
    </>
  );
};

export default ReplyPage;
