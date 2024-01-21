import React from "react";
import Avatar from "../shared/Avatar";
import { User } from "@prisma/client";
import { twMerge } from "tailwind-merge";

const UsersList = ({ users, title }: { title?: string; users: User[] }) => {
  return (
    <section className="flex flex-col items-start justify-start gap-3">
      {!!title && (
        <h5 className="min-w-full text-left capitalize text-white font-semibold text-2xl mt-10">
          {title}
        </h5>
      )}
      <div className="flex flex-col gap-6 mt-4">
        {users.map((user: Record<string, any>) => (
          <div
            key={user.id}
            className={twMerge(
              "flex flex-row gap-4 cursor-default ",
              title
                ? "hover:bg-slate-700 hover:bg-opacity-30 px-3 py-2 rounded-md min-w-full transition-all text-nowrap overflow-hidden"
                : ""
            )}
          >
            <Avatar userId={user.id} />
            <div className="flex flex-col ">
              <p className="text-white font-semibold text-sm line-clamp-1">{user.name}</p>
              <p className="text-neutral-400 text-sm">@{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsersList;
