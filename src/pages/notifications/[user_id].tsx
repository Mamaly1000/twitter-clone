import NotificationsFeed from "@/components/lists/NotificationsFeed";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";

export const getServerSideProps = async (ctx: NextPageContext) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

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
