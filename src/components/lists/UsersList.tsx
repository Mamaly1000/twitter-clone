import React from "react";
import { User } from "@prisma/client";
import RecommendedUserCard from "../cards/RecommendedUserCard";
import { isEmpty } from "lodash";
import { twMerge } from "tailwind-merge";

const UsersList = ({
  users,
  title,
  main,
}: {
  main?: boolean;
  title?: string;
  users: User[];
}) => {
  if (isEmpty(users)) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl">No Users</div>
    );
  }
  return (
    <section className="flex flex-col items-start justify-start gap-3 min-w-full">
      {!!title && (
        <h5 className="min-w-full text-left capitalize text-white font-semibold text-2xl mt-10 px-3">
          {title}
        </h5>
      )}
      <div className={twMerge("flex flex-col mt-4 min-w-full", main ?"gap-0": "gap-6 ")}>
        {users.map((user) => (
          <RecommendedUserCard main key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
};

export default UsersList;
