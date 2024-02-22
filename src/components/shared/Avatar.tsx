import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import placeholder from "../../../public/placeholder.png";
import useProfileImage from "@/hooks/useProfileImage";
const Avatar = ({
  userId,
  isLarge = false,
  hasBorder = false,
  className,
  repost,
}: {
  repost?: boolean;
  className?: string;
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
}) => {
  const { user } = useProfileImage(userId);
  const router = useRouter();
  const onClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      const url = `/users/${userId}`;
      router.push(url);
    },
    [router, userId]
  );
  if (!user) return null;
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "rounded-full hover:opacity-90 transition-all cursor-pointer relative ",
        hasBorder ? "border-4 border-black" : "",
        isLarge
          ? "min-h-32 min-w-32 max-h-32 max-w-32"
          : "w-[40px] h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] min-h-[40px] w- ",
        className,
        repost &&
          "min-w-[20px] max-h-[20px] min-h-[20px] max-w-[20px] border-[1px] border-black"
      )}
    >
      <Image
        fill
        src={user?.profileImage || placeholder.src}
        alt={user?.username || "profile image"}
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default Avatar;
