import { useMemo } from "react";
import { BiCalendar } from "react-icons/bi";
import { format } from "date-fns";

import useCurrentUser from "@/hooks/useCurrentUser";
import useUser from "@/hooks/useUser";

import Button from "@/components/inputs/Button";
import { useEditModal } from "@/hooks/useEditModal";
import useFollow from "@/hooks/useFollow";
import { includes } from "lodash";
import { User } from "@prisma/client";
import Loader from "./Loader";
import FieldIcon from "./FieldIcon";
import FieldValue from "./FieldValue";
import { formatString } from "@/libs/wordDetector";
import MutualFollowers from "../lists/MutualFollowers";

interface UserBioProps {
  userId: string;
}

const UserBio: React.FC<UserBioProps> = ({ userId }) => {
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const { user: fetchedUser, isLoading: userLoading } = useUser(userId);

  const editModal = useEditModal();

  const { isFollowing, toggleFollow } = useFollow(userId);

  const createdAt = useMemo(() => {
    if (!fetchedUser?.createdAt) {
      return null;
    }

    return format(new Date(fetchedUser.createdAt), "MMMM yyyy");
  }, [fetchedUser?.createdAt]);

  if (!currentUser || currentUserLoading || !fetchedUser || userLoading) {
    return <Loader message="loading user data" />;
  }
  return (
    <div className="border-b-[1px] border-neutral-800 pb-4">
      <div className="flex justify-end p-2">
        {currentUser?.id === userId ? (
          <Button secondary onClick={editModal.onOpen}>
            Edit profile
          </Button>
        ) : (
          <Button
            onClick={toggleFollow}
            secondary={!isFollowing}
            outline={isFollowing}
          >
            {isFollowing
              ? "Unfollow"
              : includes((fetchedUser as User).followingIds, currentUser?.id)
              ? "follow back"
              : "follow"}
          </Button>
        )}
      </div>
      <div className="mt-8 px-4">
        <div className="flex flex-col">
          <p className="text-white text-2xl font-semibold">
            {fetchedUser?.name}
          </p>
          <p className="text-md text-neutral-500">@{fetchedUser?.username}</p>
        </div>
        <div className="flex flex-col mt-4">
          <p
            className="text-white"
            dangerouslySetInnerHTML={{
              __html: formatString(fetchedUser?.bio || ""),
            }}
          ></p>
          <div className="w-[80%] mt-5 sm:max-w-[70%] flex flex-wrap items-start justify-start gap-x-3 gap-y-2 text-[12px] md:text-[16px]">
            {fetchedUser.profileFields.map((f) => (
              <FieldValue
                size={15}
                f={f}
                key={f.id}
                className="flex flex-row items-center gap-2 text-[#72767A]  "
              />
            ))}
            <div
              className="
              flex 
              flex-row 
              items-center 
              gap-2    
              text-[#72767A]
          "
            >
              <BiCalendar size={15} />
              <p>Joined {createdAt}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4 gap-6">
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{fetchedUser?.followingIds?.length}</p>
            <p className="text-neutral-500">Following</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{fetchedUser!.followerIds.length || 0}</p>
            <p className="text-neutral-500">Followers</p>
          </div>
        </div>
        <MutualFollowers
          others={fetchedUser.mutualFollowersCount}
          followers={fetchedUser.mutualFollowers}
        />
      </div>
    </div>
  );
};

export default UserBio;
