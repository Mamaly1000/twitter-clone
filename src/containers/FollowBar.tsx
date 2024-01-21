import UsersList from "@/components/lists/UsersList";
import Avatar from "@/components/shared/Avatar";
import useUsers from "@/hooks/useUsers";
import React from "react";

const FollowBar = () => {
  const { users } = useUsers();
  return (
    <div className="px-6 py-4 hidden xl:block">
      <div className="bg-neutral-800 rounded-xl p-4">
        <h2 className="text-white text-xl font-semibold">Who to follow</h2>
        <UsersList   users={users} />
      </div>
    </div>
  );
};

export default FollowBar;
