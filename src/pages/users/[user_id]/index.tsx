import PostFeed from "@/components/lists/PostFeed ";
import Loader from "@/components/shared/Loader";
import UserBio from "@/components/shared/UserBio";
import UserHero from "@/components/shared/UserHero";
import Header from "@/containers/Header";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";

const UserPage = () => {
  const router = useRouter();
  const userId = router.query.user_id as string;
  const { user, isLoading } = useUser(userId);
  if (!user || isLoading) return <Loader message="loading user profile!" />;
  const userData: User = user;
  return (
    <div>
      <Header displayArrow label={userData.name || "User profile"} />
      <UserHero id={userId} />
      <UserBio userId={userId} />
      <PostFeed id={userId} />
    </div>
  );
};

export default UserPage;
