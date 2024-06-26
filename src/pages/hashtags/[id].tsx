import PostFeed from "@/components/lists/PostFeed ";
import UsersCardFeed from "@/components/lists/UsersCardFeed";
import Header from "@/containers/Header";
import useHashtag from "@/hooks/useHashtag";
import { useRouter } from "next/router";
import React from "react";

const SingleHashtagPage = () => {
  const router = useRouter();
  const hashtagId = router.query.id as string;
  const { hashtag } = useHashtag(hashtagId);

  return (
    <>
      <Header
        label={`#${hashtag?.name}`}
        subHeader={`${hashtag?.postIds?.length} tweets`}
        displayArrow
      />
      <UsersCardFeed
        params={{ hashtagId: hashtag?.id, type: "hashtag" }}
        title="People"
      />
      <PostFeed
        className="border-t-[1px] border-neutral-300 dark:border-neutral-800"
        type="hashtag"
        hashtagId={hashtagId}
      />
    </>
  );
};

export default SingleHashtagPage;
