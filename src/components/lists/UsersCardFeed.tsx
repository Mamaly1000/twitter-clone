import { User } from "@prisma/client";
import { isEmpty } from "lodash";
import React, { Suspense, useEffect } from "react";
import Loader from "../shared/Loader";
import LargeUserCard from "../cards/LargeUserCard";
import { useInView } from "react-intersection-observer";
import UsersPagination from "../shared/UsersPagination";
import useUsers, { usersParams } from "@/hooks/useUsers";
import UserFeedSkeletonCard from "../SkeletonCards/UserFeedSkeletonCard";
import Each from "../shared/Each";

const UsersCardFeed = ({
  title,
  params,
}: {
  params?: usersParams;
  title?: string;
}) => {
  const { users, usersLoading } = useUsers(params);

  return (
    <section className="min-w-full max-w-full text-[#d9d9d9] flex flex-col items-start justify-start gap-4 mt-3">
      {title && (
        <h2 className="min-w-full px-3 text-left text-[20px] font-bold capitalize">
          {title}
        </h2>
      )}
      {!usersLoading && !isEmpty(users) && (
        <div className="min-w-full max-w-full overflow-auto flex items-center justify-start gap-3 px-3 pb-2">
          {users?.map((user) => (
            <LargeUserCard user={user} key={user.id} />
          ))}
          <UsersPagination horizantal params={params} />
        </div>
      )}
      {(usersLoading || isEmpty(users)) && (
        <div className="min-w-full max-w-full overflow-auto flex items-center justify-start gap-3 px-3 pb-2">
          <Each
            of={[1, 2, 3, 4, 5, 6]}
            render={(_i, index) => <UserFeedSkeletonCard key={index} />}
          />
        </div>
      )}
    </section>
  );
};

export default UsersCardFeed;
