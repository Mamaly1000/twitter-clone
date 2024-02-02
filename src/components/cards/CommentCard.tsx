import { Comment, Post, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Avatar from "../shared/Avatar";
import { twMerge } from "tailwind-merge";
import { BiDotsVertical, BiRepost } from "react-icons/bi";
import { formatString } from "@/libs/wordDetector";
import toast from "react-hot-toast";
import axios from "axios";
import usePost from "@/hooks/usePost";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { includes } from "lodash";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal"; 

const CommentCard = ({
  comment,
  i,
  lastIndex,
  userId,
  postAuthor,
  postId,
}: {
  postId: string;
  postAuthor: string;
  userId: string;
  lastIndex: number;
  i: number;
  comment: Comment & { user?: any; post: Post & { user: User } };
}) => {
  const router = useRouter();
  const { mutate: postMutate } = usePost(postId);
  const { mutate: userMutate } = useCurrentUser();

  const [scrollHeight, setHeight] = useState(50);
  const commentRef: React.LegacyRef<HTMLDivElement> | undefined = useRef(null);

  const loginModal = useLoginModal();

  const [isLoading, setLoading] = useState(false);

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();

      router.push(`/users/${comment.user.id}`);
    },
    [router, comment.user.id]
  );

  const createdAt = useMemo(() => {
    if (!comment?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(comment.createdAt));
  }, [comment.createdAt]);

  const onLike = useCallback(async () => {
    if (!isLoading) {
      try {
        setLoading(true);
        await axios
          .patch(`/api/comments/like/${comment.postId}`)
          .then((res) => {
            toast.success(res.data.message);
            postMutate();
            userMutate();
          });
      } catch (error: any) {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("something went wrong!");
        }
      }
    }
  }, [
    comment.postId,
    userId,
    isLoading,
    setLoading,
    postId,
    postMutate,
    userMutate,
  ]);

  const isliked = useMemo(() => {
    const list = [...(comment.post.likedIds || [])];
    return includes(list, userId);
  }, [comment.post.likedIds, userId]);

  const onRepost = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!userId) {
        loginModal.onOpen();
      }

      if (comment.postId) router.push(`/repost/${comment.postId}`);
    },
    [loginModal, userId, comment.postId]
  );

  useEffect(() => {
    const handleResize = () => {
      if (commentRef) {
        setHeight(commentRef.current!.offsetHeight);
      }
    };
    if (commentRef) {
      setHeight(commentRef.current!.offsetHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollHeight, window, commentRef]);

  const LikeIcon = isliked ? AiFillHeart : AiOutlineHeart;

  return (
    <div
      className={twMerge(
        `min-w-full px-5  cursor-pointer hover:bg-neutral-900 transition-all `,
        i === 0 ? "pt-4 pb-1" : "py-1",
        lastIndex === i && "pb-3"
      )}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/posts/${comment.postId}`);
      }}
    >
      <div className="flex flex-row items-start gap-3">
        <div className="w-fit flex items-center justify-start gap-2 flex-col">
          <Avatar userId={comment.user.id} />
          <hr
            className="w-[2px] rounded-md bg-neutral-300 bg-opacity-50 border-none transition-all"
            style={{
              minHeight: lastIndex === i ? scrollHeight - 20 : scrollHeight,
            }}
          />
          {lastIndex === i && (
            <span className="flex flex-col text-neutral-300 text-opacity-50 text-lg gap-1 ">
              <BiDotsVertical />
            </span>
          )}
        </div>
        <div ref={commentRef} className="min-h-fit">
          <div className="flex flex-col  items-start justify-start">
            <div className="flex items-center justify-start gap-1">
              <p
                onClick={goToUser}
                className="
                  text-white 
                  font-semibold 
                  cursor-pointer 
                  hover:underline
              "
              >
                {comment.user.name}
              </p>
              <span
                onClick={goToUser}
                className="
                  text-neutral-500
                  cursor-pointer
                  hover:underline
                  hidden
                  md:block
              "
              >
                @{comment.user.username}
              </span>
              <span className="text-neutral-500 text-sm">{createdAt}</span>
            </div>
            {!!(comment.userId !== userId) && (
              <p
                className="text-neutral-400 capitalize"
                dangerouslySetInnerHTML={{
                  __html: formatString(`replying to @${postAuthor}`),
                }}
              ></p>
            )}
          </div>
          <p
            dangerouslySetInnerHTML={{ __html: formatString(comment.body) }}
            className="text-white mt-3 capitalize"
          ></p>
          <div className={twMerge("flex flex-row items-center gap-10 mt-4")}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/reply/${comment.postId}`);
              }}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500"
            >
              <AiOutlineMessage size={20} />
              <p>{comment.post.commentIds.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition-all hover:text-red-500"
            >
              <LikeIcon color={isliked ? "red" : ""} size={20} />
              <p>{comment.post.likedIds.length}</p>
            </div>
            <div
              onClick={onRepost}
              className={twMerge("hover:text-sky-400 text-neutral-500 ")}
            >
              <BiRepost size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
