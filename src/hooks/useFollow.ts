import { useCallback, useMemo, useState } from "react";
import useCurrentUser from "./useCurrentUser";
import { useLoginModal } from "./useLoginModal";
import useUser from "./useUser";
import { toast } from "react-toastify";
import axios from "axios";
import { includes } from "lodash";
import useUsers from "./useUsers";

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(userId);
  const { mutate: usersMutate } = useUsers({ type: "all" });
  const { mutate: recommendedUsersMutate } = useUsers({
    type: "recommended",
    userId: currentUser?.id,
  });
  const [isLoading, setLoading] = useState(false);
  const loginModal = useLoginModal();

  const toggleFollow = useCallback(
    async (e?: any) => {
      e?.stopPropagation();
      if (!currentUser) {
        return loginModal.onOpen();
      } else {
        try {
          setLoading(true);
          await axios.patch(`/api/follow/${userId}`).then((res) => {
            toast.success(res.data.message);
            mutateCurrentUser();
            mutateFetchedUser();
            usersMutate();
            recommendedUsersMutate();
          });
        } catch (error) {
          toast.error("something went wrong!");
        } finally {
          setLoading(false);
        }
      }
    },
    [
      currentUser,
      loginModal,
      userId,
      mutateCurrentUser,
      mutateFetchedUser,
      usersMutate,
      setLoading,
      isLoading,
      recommendedUsersMutate,
    ]
  );

  const isFollowing = useMemo(() => {
    const list = includes(currentUser?.followingIds, userId);

    return list;
  }, [currentUser, userId]);

  return { isFollowing, toggleFollow, isLoading };
};

export default useFollow;
