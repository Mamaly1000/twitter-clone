import TweetCard from "@/components/cards/TweetCard";
import CreatePost from "@/components/forms/CreatePost";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import React from "react";

const RepostPage = () => {
  const router = useRouter();
  const postId = router.query.id as string;
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { post, isLoading } = usePost(postId);
  if (userLoading || isLoading || !user || !post) {
    return <Loader message="preparing tweet repost." />;
  }
  return (
    <div>
      <Header label="retweet the tweet" displayArrow />
      <TweetCard post={post} isComment userId={user.id} />
      <CreatePost
        isRepost
        postId={post.id}
        mainPage
        placeholder="write your quote... (optional)"
      />
    </div>
  );
};

export default RepostPage;
