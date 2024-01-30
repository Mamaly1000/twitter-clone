import useCurrentUser from "@/hooks/useCurrentUser";
import useFollowers from "@/hooks/useFollowers";
import React from "react";
import Loader from "../shared/Loader";
import UserCard from "../cards/UserCard";

const FollowersList = ({ id }: { id?: string }) => {
  const { data: currentUser, isLoading } = useCurrentUser();
  const { followers, isLoading: followersLoading } = useFollowers(id);

  if (!currentUser || isLoading) {
    return <Loader message="please for loading data" />;
  }

  if (followersLoading || !followers) {
    return <Loader message="loading users followers" />;
  }
  if (followers.length === 0) {
    return (
      <div className="min-w-full flex justify-center items-center min-h-[300px] capitalize text-lg text-neutral-500">
        no one is following this user...
      </div>
    );
  }
  return (
    <section className="min-w-full max-w-full overflow-hidden flex flex-col items-start justify-start gap-0 min-h-[400px]">
      {followers.map((user) => {
        return <UserCard key={user.id} user={user} currentUser={currentUser} />;
      })}
    </section>
  );
};

export default FollowersList;
