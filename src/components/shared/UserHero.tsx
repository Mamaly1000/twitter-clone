import React from "react";
import Avatar from "./Avatar";
import Image from "next/image";
import useCoverImage from "@/hooks/useCoverImage";
import UserSkeletonHero from "../SkeletonCards/UserSkeletonHero";

const UserHero = ({ id }: { id: string }) => {
  const { coverImage } = useCoverImage(id);
  return coverImage ? (
    <div>
      <div className="dark:bg-neutral-700 bg-neutral-500 h-44 relative">
        {coverImage && (
          <Image
            src={coverImage.imageUrl}
            fill
            alt="Cover Image"
            style={{ objectFit: "cover" }}
          />
        )}
        <div className="absolute -bottom-16 left-4">
          <Avatar
            className="border-[5px] dark:border-black border-light"
            userId={id}
            isLarge
            hasBorder
          />
        </div>
      </div>
    </div>
  ) : (
    <UserSkeletonHero />
  );
};

export default UserHero;
