import HashtagsFeed from "@/components/lists/HashtagsFeed";
import HashtagSearchInput from "@/components/search-components/HashtagSearchInput";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCountry from "@/hooks/useCountry";
import useCurrentUser from "@/hooks/useCurrentUser";
import useHashtags from "@/hooks/useHashtags";
import useUserLocation from "@/hooks/useUserLocation";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const HashtagsPage = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { location } = useUserLocation(currentUser?.id);
  const { isLoading, hashtags, userHashtags } = useHashtags();
  const { getByValue } = useCountry();
  const currentUserLocation = useMemo(() => {
    if (location) {
      const l = getByValue(location);
      return `${l?.label}, ${l?.city}`;
    }
    return null;
  }, [location, getByValue]);
  if (isLoading || !location || !currentUser) {
    return <Loader message="loading hashtags" />;
  }

  return (
    <>
      <Header label="hashtags" displayArrow />
      <HashtagSearchInput />
      <HashtagsFeed
        hashtags={userHashtags}
        title={`trends in ${currentUserLocation}`}
      />
      <HashtagsFeed hashtags={hashtags} title="trends for you" />
      {router.query.search && <EmptyState resetUrl="hashtags" />}
    </>
  );
};

export default HashtagsPage;
