import React from "react";
import Avatar from "../shared/Avatar";
import { User } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import Button from "../inputs/Button";
import RecommendedUserCard from "../cards/RecommendedUserCard";

const UsersList = ({ users, title }: { title?: string; users: User[] }) => {
  return (
    <section className="flex flex-col items-start justify-start gap-3 min-w-full">
      {!!title && (
        <h5 className="min-w-full text-left capitalize text-white font-semibold text-2xl mt-10">
          {title}
        </h5>
      )}
      <div className="flex flex-col gap-6 mt-4 min-w-full">
        {users.map((user) => (
          <RecommendedUserCard key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
};

export default UsersList;
