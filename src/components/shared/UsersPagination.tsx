import useCurrentUser from "@/hooks/useCurrentUser";
import useNotif from "@/hooks/useNotif";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import useUsers, { usersParams } from "@/hooks/useUsers";
import { twMerge } from "tailwind-merge";

const UsersPagination = ({
  params,
  horizantal,
}: {
  horizantal?: boolean;
  params: usersParams;
}) => {
  const { usersLoading, ref, pagination } = useUsers(params);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    if (pagination && pagination.hasNext) {
      setHasMore(true);
    }
  }, [pagination]);

  return (
    !usersLoading &&
    hasMore &&
    !(+pagination.maxPages === +pagination.currentPage) && (
      <section
        className={twMerge(
          "min-w-full p-0 m-0 flex flex-col justify-center items-center w-full max-h-[100px]",
          horizantal &&
            "min-w-[150px] min-h-[150px] max-h-[150px] max-w-[150px] flex items-center justify-center"
        )}
        ref={ref}
      >
        <Loader
          className="min-h-[100px] max-h-[100px] "
          size={25}
          type="bounce"
        />
      </section>
    )
  );
};

export default UsersPagination;
