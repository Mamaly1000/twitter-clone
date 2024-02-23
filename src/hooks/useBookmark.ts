import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser";
import toast from "react-hot-toast";
import axios from "axios";
import { includes } from "lodash";
import usePost from "./usePost";
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; 

const useBookmark = (id?: string) => { 
  const { mutate: postMutate } = usePost(id);
  const { data: user, mutate: currentUserMutate } = useCurrentUser();
  const toggleBookmark = useCallback(async () => {
    if (id) {
      try {
        await axios.post(`/api/bookmark/${id}`).then((res) => {
          toast.success(res.data.message);
          currentUserMutate();
          postMutate();
        });
      } catch (error) {
        toast.error("something went wrong!");
      }
    }
  }, [id, currentUserMutate, postMutate]);

  const isBookmarked = useMemo(() => {
    if (!id || !user) {
      return false;
    }
    return includes(user?.bookmarksIds, id);
  }, [user, id]);

  const BookmarkIcon = isBookmarked ? FaBookmark : FaRegBookmark;

  return { toggleBookmark, isBookmarked, BookmarkIcon };
};

export default useBookmark;
