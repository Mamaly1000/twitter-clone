import { Comment } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import Avatar from "../shared/Avatar";

const CommentCard = ({ comment }: { comment: Comment & { user?: any } }) => {
  const router = useRouter();

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

  return (
    <div
      className="
      min-w-full
          border-b-[1px] 
          border-neutral-800 
          p-5 
          cursor-pointer 
          hover:bg-neutral-900 
          transition
        "
    >
      <div className="flex flex-row items-start gap-3">
        <Avatar userId={comment.user.id} />
        <div>
          <div className="flex flex-row items-center gap-2">
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
          <div className="text-white mt-1">{comment.body}</div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
