import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import React from "react";
import Avatar from "./Avatar";
import Image from "next/image";
import Loader from "./Loader";

const UserHero = ({ id }: { id: string }) => {
  const { user, isLoading } = useUser(id);
  if (!user || isLoading) {
    return <Loader message="Loading data" />;
  }
  const fetchedUser: User = user;
  return (
    fetchedUser && (
      <div>
        <div className="bg-neutral-700 h-44 relative">
          {fetchedUser && fetchedUser.coverImage && (
            <Image
              src={fetchedUser.coverImage}
              fill
              alt="Cover Image"
              style={{ objectFit: "cover" }}
            />
          )}
          <div className="absolute -bottom-16 left-4">
            <Avatar className="border-[3px] border-black " userId={id} isLarge hasBorder />
          </div>
        </div>
      </div>
    )
  );
};

export default UserHero;
