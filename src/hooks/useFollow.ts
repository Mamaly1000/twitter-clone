import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser";
import { useLoginModal } from "./useLoginModal";
import useUser from "./useUser";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(userId);

  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = (currentUser as User)?.followingIds || [];
    return list.includes(userId);
  }, [currentUser, userId]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    try {
      let req;
      if (isFollowing) {
        req = () => axios.delete("/api/follow", { data: { userId } });
      } else {
        req = () => axios.post("/api/follow", { userId });
      }
      await req().then((res) => {
        toast.success(res.data.message);
        mutateCurrentUser();
        mutateFetchedUser();
      });
    } catch (error) {
      toast.error("something went wrong!");
    }
  }, [
    currentUser,
    loginModal,
    userId,
    isFollowing,
    mutateCurrentUser,
    mutateFetchedUser,
  ]);

  return { isFollowing, toggleFollow };
};

export default useFollow;
