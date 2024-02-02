import BookmarksFeed from "@/components/lists/BookmarksFeed";
import FollowingsFeed from "@/components/lists/FollowingsFeed";
import LikedPostFeed from "@/components/lists/LikedPostFeed";
import PostFeed from "@/components/lists/PostFeed ";
import RepliesFeed from "@/components/lists/RepliesFeed";
import FollowersList from "@/components/lists/followersList";
import Loader from "@/components/shared/Loader";
import UserBio from "@/components/shared/UserBio";
import UserHero from "@/components/shared/UserHero";
import TabContent from "@/components/ui/TabContent";
import Tabs from "@/components/ui/Tabs";
import Header from "@/containers/Header";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const profileTabs: {
  label: profileTabsType;
  value: string;
  disabled?: boolean;
}[] = [
  { label: "tweets", value: uuidv4() },
  { label: "replies", value: uuidv4() },
  { label: "Media", value: uuidv4() },
  { label: "Likes", value: uuidv4() },
  { label: "bookmarks", value: uuidv4() },
  { label: "followings", value: uuidv4() },
  { label: "followers", value: uuidv4() },
];

export type profileTabsType =
  | "tweets"
  | "replies"
  | "Media"
  | "Likes"
  | "bookmarks"
  | "followings"
  | "followers";

const UserPage = () => {
  const router = useRouter();
  const [profileTab, setProfileTab] = useState(profileTabs[0]);
  const userId = router.query.user_id as string;
  const { user, isLoading } = useUser(userId);
  if (!user || isLoading) return <Loader message="loading user profile!" />;

  return (
    <>
      <Header
        displayArrow
        label={user.name || "User profile"}
        subHeader={`${user.posts.length} tweets`}
      />
      <UserHero id={userId} />
      <UserBio userId={userId} />
      <Tabs
        onSelect={(val) => {
          setProfileTab(val as any);
        }}
        options={profileTabs}
        currentValue={profileTab}
      />
      <TabContent display={profileTab.label === "tweets"}>
        <PostFeed id={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "Likes"}>
        <LikedPostFeed id={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "Media"}>
        <div className="min-w-full flex items-center justify-center min-h-[300px] text-white capitalize font-bold text-lg">
          comming soon...
        </div>
      </TabContent>{" "}
      <TabContent display={profileTab.label === "bookmarks"}>
        <BookmarksFeed userId={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "replies"}>
        <RepliesFeed id={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "followers"}>
        <FollowersList id={userId} />
      </TabContent>{" "}
      <TabContent display={profileTab.label === "followings"}>
        <FollowingsFeed id={userId} />
      </TabContent>
    </>
  );
};

export default UserPage;
