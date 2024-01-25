import Loader from "@/components/shared/Loader";
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
const NotificationsPage = () => {
  return <Loader message="Loading your Notifications" />;
};

export default NotificationsPage;
