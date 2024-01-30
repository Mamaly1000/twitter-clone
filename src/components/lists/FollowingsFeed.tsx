import React from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import Loader from "../shared/Loader";
import UserCard from "../cards/UserCard";
import useFollowings from "@/hooks/useFollowings";
const FollowingsFeed = ({ id }: { id?: string }) => {
  const { data: currentUser, isLoading } = useCurrentUser();
  const { followings, isLoading: followingsLoading } = useFollowings(id);

  if (!currentUser || isLoading) {
    return <Loader message="please for loading data" />;
  }

  if (followingsLoading || !followings) {
    return <Loader message="loading users followings" />;
  }
  if (followings.length === 0) {
    return (
      <div className="min-w-full flex justify-center items-center min-h-[300px] capitalize text-lg text-neutral-500">
        no one was followed by this user...
      </div>
    );
  }
  return (
    <section className="min-w-full max-w-full overflow-hidden flex flex-col items-start justify-start gap-0 min-h-[400px]">
      {followings.map((user) => {
        return <UserCard key={user.id} user={user} currentUser={currentUser} />;
      })}
    </section>
  );
};
export default FollowingsFeed;
