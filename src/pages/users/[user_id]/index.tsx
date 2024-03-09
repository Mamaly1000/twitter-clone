import PostFeed from "@/components/lists/PostFeed ";
import UsersList from "@/components/lists/UsersList";
import UserBio from "@/components/shared/UserBio";
import UserHero from "@/components/shared/UserHero";
import TabContent from "@/components/ui/TabContent";
import Tabs from "@/components/ui/Tabs";
import Header from "@/containers/Header";
import { PostsType } from "@/hooks/usePosts";
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
  { label: "media", value: uuidv4() },
  { label: "liked", value: uuidv4() },
  { label: "bookmark", value: uuidv4() },
  { label: "followings", value: uuidv4() },
  { label: "followers", value: uuidv4() },
];

export type profileTabsType = PostsType | "tweets" | "followings" | "followers";

const UserPage = () => {
  const router = useRouter();
  const [profileTab, setProfileTab] = useState(profileTabs[0]);
  const userId = router.query.user_id as string;
  const { user } = useUser(userId);

  return (
    <>
      <Header
        displayArrow
        label={user?.name || "User profile"}
        subHeader={`${user?.posts?.length} tweets`}
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
      <TabContent display={profileTab.label === "liked"}>
        <PostFeed type="liked" id={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "media"}>
        <PostFeed type="media" id={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "bookmark"}>
        <PostFeed type="bookmark" id={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "replies"}>
        <PostFeed type="replies" id={userId} />
      </TabContent>
      <TabContent display={profileTab.label === "followers"}>
        <UsersList
          emptyType="users"
          params={{ userId: userId, type: "followers" }}
          main
        />
      </TabContent>
      <TabContent display={profileTab.label === "followings"}>
        <UsersList
          emptyType="users"
          params={{ userId: userId, type: "followings" }}
          main
        />
      </TabContent>
    </>
  );
};

export default UserPage;
