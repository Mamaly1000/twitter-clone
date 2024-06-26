import UsersCardFeed from "@/components/lists/UsersCardFeed";
import UsersList from "@/components/lists/UsersList";
import UsersSearchInput from "@/components/search-components/UsersSearchInput";
import EmptyState from "@/components/shared/EmptyState";
import Header from "@/containers/Header";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/router";
import React from "react";

const UsersPage = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  return (
    <>
      <Header label="users" displayArrow />
      <UsersSearchInput key={router.query?.search + ""} />
      {!router.query.search && (
        <UsersCardFeed
          params={{ type: "followers", userId: user?.id }}
          title="your followers"
        />
      )}
      <UsersList
        main
        emptyType={!!router.query.search ? "user-search" : "users"}
        params={{ type: "all", search: router.query.search as string }}
        title="people"
      />
      {router.query.search && <EmptyState resetUrl="users" />}
    </>
  );
};

export default UsersPage;
