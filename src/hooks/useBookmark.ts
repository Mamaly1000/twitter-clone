import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser";
import { toast } from "react-toastify";
import axios from "axios";
import { includes } from "lodash";
import usePost from "./usePost";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const useBookmark = (postId?: string) => {
  const { mutate: postMutate, post } = usePost(postId);
  const { data: user, mutate: currentUserMutate } = useCurrentUser();
  const toggleBookmark = useCallback(async () => {
    if (postId) {
      try {
        await axios.post(`/api/bookmark/${postId}`).then((res) => {
          toast.success(res.data.message); 
          postMutate();
        });
      } catch (error) {
        toast.error("something went wrong!");
      }
    }
  }, [postId, currentUserMutate, postMutate]);

  const isBookmarked = useMemo(() => {
    if (!postId || !user) {
      return false;
    }
    return includes(post?.bookmarkedIds, user?.id);
  }, [user, postId, post]);

  const BookmarkIcon = isBookmarked ? FaBookmark : FaRegBookmark;

  return { toggleBookmark, isBookmarked, BookmarkIcon };
};

export default useBookmark;
