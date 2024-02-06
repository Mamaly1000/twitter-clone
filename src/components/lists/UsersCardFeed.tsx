import { User } from "@prisma/client";
import { isEmpty } from "lodash";
import React from "react";
import Loader from "../shared/Loader";
import LargeUserCard from "../cards/LargeUserCard";

const UsersCardFeed = ({ users, title }: { users: User[]; title?: string }) => {
  if (isEmpty(users)) {
    return <Loader message="loading users" />;
  }
  return (
    <section className="min-w-full max-w-full text-[#d9d9d9] flex flex-col items-start justify-start gap-4 mt-3">
      {title && (
        <h2 className="min-w-full px-3 text-left text-[20px] font-bold">
          {title}
        </h2>
      )}
      <div className="min-w-full max-w-full overflow-auto flex items-center justify-start gap-3 px-3">
        {users.map((user) => (
          <LargeUserCard user={user} key={user.id} />
        ))}
      </div>
    </section>
  );
};

export default UsersCardFeed;
