import { useCallback, useMemo, useState } from "react";
import useCurrentUser from "./useCurrentUser";
import { useLoginModal } from "./useLoginModal";
import useUser from "./useUser";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";
import { includes } from "lodash";
import useRecommendedUsers from "./useRecommendedUsers";
import useUsers from "./useUsers";

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(userId);
  const { mutate: recommendUsers } = useRecommendedUsers();
  const { mutate: usersMutate } = useUsers();
  const [isLoading, setLoading] = useState(false);
  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = (currentUser as User)?.followingIds || [];
    return list.includes(userId);
  }, [currentUser, userId]);

  const toggleFollow = useCallback(
    async (e?: any) => {
      e?.stopPropagation();
      if (!currentUser) {
        return loginModal.onOpen();
      }
      try {
        setLoading(true);
        axios.patch(`/api/follow/${userId}`).then((res) => {
          toast.success(res.data.message);
          mutateCurrentUser();
          mutateFetchedUser();
          recommendUsers();
          usersMutate();
        });
      } catch (error) {
        toast.error("something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    [
      currentUser,
      loginModal,
      userId,
      isFollowing,
      mutateCurrentUser,
      mutateFetchedUser,
      recommendUsers,
      usersMutate,
      setLoading,
      isLoading,
    ]
  );
  console.log(isLoading);

  return { isFollowing, toggleFollow, isLoading };
};

export default useFollow;
