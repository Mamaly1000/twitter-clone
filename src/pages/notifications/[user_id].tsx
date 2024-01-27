import NotificationsFeed from "@/components/lists/NotificationsFeed";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import React from "react";

const UserNotificationsPage = () => {
  const { data: user, isLoading } = useCurrentUser();
  if (!user || isLoading) {
    return <Loader message="Loading your Notifications" />;
  }
  return (
    <>
      <Header label="Notifications" displayArrow />
      <NotificationsFeed />
    </>
  );
};

export default UserNotificationsPage;
