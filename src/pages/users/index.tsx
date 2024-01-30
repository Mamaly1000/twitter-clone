import useCurrentUser from "@/hooks/useCurrentUser";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const UsersPage = () => {
  const { data: user } = useCurrentUser();
  useEffect(() => {
    if (user) {
      redirect(`/users/${user.id}`);
    } else {
      redirect("/");
    }
  }, [user]);
  return <div>UsersPage</div>;
};

export default UsersPage;
