import React from "react";
import RecommendedUserCard from "../cards/RecommendedUserCard";
import { isEmpty } from "lodash";
import { twMerge } from "tailwind-merge";
import useUsers, { usersParams } from "@/hooks/useUsers";
import UsersPagination from "../shared/UsersPagination";
import Each from "../shared/Each";
import SmallUserCardSkeleton from "../SkeletonCards/SmallUserCardSkeleton";
import EmptyMessage from "../shared/EmptyMessage";

const UsersList = ({
  title,
  main,
  params,
  emptyType,
}: {
  emptyType?: "users" | "user-search";
  params?: usersParams;
  main?: boolean;
  title?: string;
}) => {
  const { users, usersLoading } = useUsers(params);
  if (usersLoading && isEmpty(users)) {
    return (
      <Each
        of={!main ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        render={(_item, index) => (
          <SmallUserCardSkeleton main={main} key={index} />
        )}
      />
    );
  }
  if (isEmpty(users) && !usersLoading) {
    return (
      <EmptyMessage type={emptyType as any}>there is no users!</EmptyMessage>
    );
  }
  return (
    <section className="flex flex-col items-start justify-start gap-3 min-w-full max-w-full min-h-fit ">
      {!!title && (
        <h5 className="min-w-full text-left capitalize text-text-primary dark:text-white font-semibold text-2xl mt-10 px-3">
          {title}
        </h5>
      )}
      <div
        className={twMerge(
          "flex flex-col mt-4 min-w-full max-w-full",
          main ? "gap-0" : "gap-2 "
        )}
      >
        {users.map((user) => (
          <RecommendedUserCard main={main} key={user.id} user={user} />
        ))}
      </div>
      {main && <UsersPagination params={params} />}
    </section>
  );
};

export default UsersList;
