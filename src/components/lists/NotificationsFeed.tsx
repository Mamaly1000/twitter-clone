import useCurrentUser from "@/hooks/useCurrentUser";
import useNotif from "@/hooks/useNotif";
import React, { useEffect } from "react";
import NotifCard from "../cards/NotifCard";
import Loader from "../shared/Loader";
import NotifPagination from "../shared/NotifPagination";

const NotificationsFeed = () => {
  const { mutate: userMutate } = useCurrentUser();
  const { notifs = [], isLoading } = useNotif();

  useEffect(() => {
    userMutate();
  }, [userMutate]);

  if (isLoading) {
    return <Loader message="Loading Notifications" />;
  }

  if (notifs.length === 0) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl">
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-full max-w-full overflow-x-hidden">
      {notifs.map((notification: Record<string, any>) => (
        <NotifCard notif={notification as any} key={notification.id} />
      ))}
      <NotifPagination />
    </div>
  );
};

export default NotificationsFeed;
