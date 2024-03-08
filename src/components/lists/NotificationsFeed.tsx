import useCurrentUser from "@/hooks/useCurrentUser";
import useNotif, { notifQueryType } from "@/hooks/useNotif";
import React, { useEffect } from "react";
import NotifCard from "../cards/NotifCard";
import Loader from "../shared/Loader";
import NotifPagination from "../shared/NotifPagination";
import SkeletonNotifCard from "../SkeletonCards/SkeletonNotifCard";
import { isEmpty } from "lodash";
import Each from "../shared/Each";

const NotificationsFeed = ({ params }: { params?: notifQueryType }) => {
  const { mutate: userMutate } = useCurrentUser();
  const { notifs = [], isLoading } = useNotif(params);

  useEffect(() => {
    userMutate();
  }, [userMutate]);

  if (isLoading) {
    return (
      <section className="flex flex-col min-w-full max-w-full overflow-x-hidden">
        <Each
          of={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          render={(_item, index) => <SkeletonNotifCard key={index} />}
        />
      </section>
    );
  }

  if (!isLoading && isEmpty(notifs)) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl">
        No notifications
      </div>
    );
  }

  return (
    <section className="flex flex-col min-w-full max-w-full overflow-x-hidden">
      {notifs.map((notification: Record<string, any>) => (
        <NotifCard notif={notification as any} key={notification.id} />
      ))}
      <NotifPagination params={params} />
    </section>
  );
};

export default NotificationsFeed;
