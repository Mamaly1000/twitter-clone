import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser";
import { useLoginModal } from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";
import { Post } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";

const useLike = ({ postId, userId }: { postId: string; userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { post, mutate: mutatePost } = usePost(postId);
  const { mutate: mutatePosts } = usePosts(userId);

  const loginModal = useLoginModal();

  const hasLiked = useMemo(() => {
    if (currentUser) {
      const list = (post as Post)?.likedIds || [];
      return list.includes(currentUser!.id);
    }
    return false;
  }, [post, currentUser]);

  const toggleLike = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    try {
      let req;
      if (hasLiked) {
        req = () =>
          axios.delete("/api/like", {
            data: {
              postId,
            },
          });
      } else {
        req = () =>
          axios.post("/api/like", {
            postId,
          });
      }
      await req().then((res) => {
        mutatePosts();
        mutatePost();
        toast.success(res.data.message);
      });
    } catch (error) {
      toast.error("something went wrong!");
    }
  }, [currentUser, loginModal, mutatePosts, mutatePost, postId, hasLiked]);

  return { toggleLike, hasLiked };
};

export default useLike;
