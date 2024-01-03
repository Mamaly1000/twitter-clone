import useUser from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import placeholder from "../../../public/placeholder.png";
const Avatar = ({
  userId,
  isLarge = false,
  hasBorder = false,
  className,
}: {
  className?: string;
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
}) => {
  const { user } = useUser(userId);
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
        isLarge ? "h-32 w-32" : "h-12 w-12",
        className
      )}
    >
      <Image
        fill
        src={user?.profileImage || placeholder.src}
        alt={user?.username}
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default Avatar;