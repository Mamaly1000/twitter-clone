import Loader from "@/components/shared/Loader";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const NotificationsPage = () => {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading)
      if (user) {
        router.push(`/notifications/${user.id}`);
      } else {
        router.back();
      }
  }, [user, isLoading]);
  return <Loader message="Loading your Notifications" />;
};

export default NotificationsPage;
