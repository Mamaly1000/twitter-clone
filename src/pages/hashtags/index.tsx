import HashtagsFeed from "@/components/lists/HashtagsFeed";
import HashtagSearchInput from "@/components/search-components/HashtagSearchInput";
import EmptyState from "@/components/shared/EmptyState";
import TrendHashtags from "@/components/shared/TrendHashtags";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import useTrendHashtags from "@/hooks/useTrendHashtags";
import useUserLocation from "@/hooks/useUserLocation";
import { useRouter } from "next/router";
import React from "react";

const HashtagsPage = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { hashtags } = useTrendHashtags();
  const { location } = useUserLocation(currentUser?.id);

  return (
    <>
      <Header label="Explore" displayArrow />
      <HashtagSearchInput />
      {!router.query.search && (
        <TrendHashtags
          MainPage
          userLocation={location}
          hashtags={hashtags || []}
        />
      )}
      <HashtagsFeed
        params={{
          search: router.query.search as string,
        }}
        title="# trends for you #"
      />
      {router.query.search && <EmptyState resetUrl="hashtags" />}
    </>
  );
};

export default HashtagsPage;
