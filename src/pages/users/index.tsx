import UsersCardFeed from "@/components/lists/UsersCardFeed";
import UsersList from "@/components/lists/UsersList";
import UsersSearchInput from "@/components/search-components/UsersSearchInput";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import useFollowers from "@/hooks/useFollowers";
import useUsers from "@/hooks/useUsers";
import { useRouter } from "next/router";
import React from "react";

const UsersPage = () => {
  const router = useRouter();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { users, isLoading: allUsersLoading } = useUsers();
  const { followers, isLoading: followersLoading } = useFollowers(user?.id);
  if (currentUserLoading || allUsersLoading || followersLoading || !users) {
    return <Loader message="loading users" />;
  }

  return (
    <>
      <Header label="users" displayArrow />
      <UsersSearchInput />
      {!router.query.search && (
        <UsersCardFeed users={followers as any} title="your followers" />
      )}{" "}
      <UsersList main title="people" users={users} />
      {router.query.search && <EmptyState resetUrl="users" />}
    </>
  );
};

export default UsersPage;
