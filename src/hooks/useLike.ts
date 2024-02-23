import { useCallback, useMemo, useState } from "react";
import useCurrentUser from "./useCurrentUser";
import { useLoginModal } from "./useLoginModal";
import usePost from "./usePost";
import { Post } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";

const useLike = ({ postId, userId }: { postId?: string; userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { post, mutate: mutatePost } = usePost(postId);
  const [likeLoading, setLoading] = useState(false);
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
      setLoading(true);
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
        mutatePost();
        toast.success(res.data.message);
      });
    } catch (error) {
      toast.error("something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [currentUser, loginModal, mutatePost, postId, hasLiked, setLoading]);

  return { toggleLike, hasLiked, likeLoading };
};

export default useLike;
