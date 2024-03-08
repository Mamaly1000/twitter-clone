import NotificationsFeed from "@/components/lists/NotificationsFeed";
import { notifTypes } from "@/components/shared/NotifImage";
import TabContent from "@/components/ui/TabContent";
import Tabs from "@/components/ui/Tabs";
import Header from "@/containers/Header";
import React, { useState } from "react";

const notifTabs: {
  label: string;
  type: notifTypes | "ALL";
}[] = [
  {
    label: "All",
    type: "ALL",
  },
  {
    label: "likes",
    type: "LIKE",
  },
  {
    label: "disLikes",
    type: "DISLIKE",
  },
  {
    label: "bookmarks",
    type: "BOOKMARK",
  },
  {
    label: "unBookmarks",
    type: "UNBOOKMARK",
  },
  {
    label: "tweets",
    type: "TWEET",
  },
  {
    label: "reposts",
    type: "REPOST",
  },
  {
    label: "replies",
    type: "COMMENT",
  },
  {
    label: "follows",
    type: "FOLLOW",
  },
  {
    label: "unFollows",
    type: "UNFOLLOW",
  },
  {
    label: "mentions",
    type: "MENTION",
  },
];

const UserNotificationsPage = () => {
  const [selectedTab, setSelectedTab] = useState<{
    label: string;
    type: notifTypes | "ALL";
  }>(notifTabs[0]);
  return (
    <>
      <Header label="Notifications" displayArrow />
      <Tabs
        onSelect={(val) => {
          setSelectedTab({ label: val.label, type: val.value as any });
        }}
        options={notifTabs.map((o) => ({ label: o.label, value: o.type }))}
        currentValue={{ label: selectedTab.label, value: selectedTab.type }}
      />
      <TabContent display={selectedTab.type === "ALL"}>
        <NotificationsFeed />
      </TabContent>
      <TabContent display={selectedTab.type === "BOOKMARK"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "COMMENT"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "DISLIKE"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "FOLLOW"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "LIKE"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "MENTION"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "REPOST"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "TWEET"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "UNBOOKMARK"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
      <TabContent display={selectedTab.type === "UNFOLLOW"}>
        <NotificationsFeed
          params={{
            type: selectedTab.type as notifTypes,
          }}
        />
      </TabContent>
    </>
  );
};

export default UserNotificationsPage;
