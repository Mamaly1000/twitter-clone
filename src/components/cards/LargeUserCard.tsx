import useCoverImage from "@/hooks/useCoverImage";
import useProfileImage from "@/hooks/useProfileImage";
import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import placeholder from "../../../public/images/placeholder.jpg";

const LargeUserCard = ({ user }: { user: User }) => {
  const { user: userImage } = useProfileImage(user.id);
  const { coverImage } = useCoverImage(user.id);

  return (
    <article className="min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px] rounded-lg drop-shadow-2xl p-0 relative">
      <div className="aspect-video min-w-full max-w-full overflow-hidden rounded-t-lg min-h-[120px] max-h-[120px] relative">
        <Image
          src={coverImage?.imageUrl || placeholder.src}
          alt={userImage?.username || ""}
          fill
          className="object-cover"
        />
      </div>
    </article>
  );
};

export default LargeUserCard;
