import UsersCardFeed from "@/components/lists/UsersCardFeed";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import useHashtag from "@/hooks/useHashtag";
import { useRouter } from "next/router";
import React from "react";

const SingleHashtagPage = () => {
  const router = useRouter();
  const hashtagId = router.query.id as string;
  const { data: currentUser } = useCurrentUser();
  const { hashtag, isLoading, posts, users } = useHashtag(hashtagId);

  if (!hashtag || isLoading) {
    return <Loader message="loading hashtag data" />;
  }

  return (
    <>
      <Header
        label={`#${hashtag.name}`}
        subHeader={`${hashtag?.postIds?.length} tweets`}
        displayArrow
      />
      <UsersCardFeed users={users} title="People" />
    </>
  );
};

export default SingleHashtagPage;
