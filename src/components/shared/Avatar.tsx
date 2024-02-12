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
}: {
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
          : "md:w-[55px] md:h-[55px] md:min-w-[55px] md:max-h-[55px] md:max-w-[55px] md:min-h-[55px] w-[35px] h-[35px] min-w-[35px] max-h-[35px] max-w-[35px] min-h-[35px]",
        className
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
