import HashtagsFeed from "@/components/lists/HashtagsFeed";
import HashtagSearchInput from "@/components/search-components/HashtagSearchInput";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCountry from "@/hooks/useCountry";
import useCurrentUser from "@/hooks/useCurrentUser";
import useUserLocation from "@/hooks/useUserLocation";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const HashtagsPage = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { location } = useUserLocation(currentUser?.id);
  const { getByValue } = useCountry();
  const currentUserLocation = useMemo(() => {
    if (location) {
      const l = getByValue(location);
      return `${l?.label}, ${l?.city}`;
    }
    return null;
  }, [location, getByValue]);
  if (!location || !currentUser) {
    return <Loader message="loading hashtags" />;
  }
  return (
    <>
      <Header label="Explore" displayArrow />
      <HashtagSearchInput />
      {/* {!router.query.search && (
        <HashtagsFeed
          hashtags={userHashtags}
          title={`trends in ${currentUserLocation}`}
        />
      )} */}
      <HashtagsFeed
        params={{
          search: router.query.search as string,
        }}
        title="trends for you"
      />
      {router.query.search && <EmptyState resetUrl="hashtags" />}
    </>
  );
};

export default HashtagsPage;
