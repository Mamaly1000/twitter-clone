import React from "react";
import CommentCard from "../cards/CommentCard";
import useComments, { commentsQueryType } from "@/hooks/useComments";
import CommentPagiantion from "../shared/CommentPagination";
import CommentSkeletonCard from "../SkeletonCards/CommentSkeletonCard";
import Each from "../shared/Each";
import { isEmpty } from "lodash";
import EmptyMessage from "../shared/EmptyMessage";

const CommentFeed = ({
  userId,
  author,
  postId,
  params,
}: {
  params?: commentsQueryType;
  postId?: string;
  author?: string;
  userId?: string;
}) => {
  const { comments, isLoading } = useComments(params);

  if (!isLoading && isEmpty(comments)) {
    return (
      <EmptyMessage type="comment">
        there is not reply for this tweet!
      </EmptyMessage>
    );
  }

  return isLoading ? (
    <div className="min-w-full flex flex-col items-start justify-start gap-0 p-0 m-0 max-w-full">
      <Each
        of={[1, 2, 3, 4, 5]}
        render={(_i, index) => <CommentSkeletonCard i={index} lastIndex={4} />}
      />
    </div>
  ) : (
    <div className="min-w-full flex flex-col items-start justify-start gap-0 p-0 m-0 max-w-full">
      {userId &&
        author &&
        postId &&
        comments?.map((comment, i, arr) => (
          <CommentCard
            comment={comment as any}
            i={i}
            lastIndex={arr.length - 1}
            key={comment.id}
            userId={userId}
            postAuthor={author}
            postId={postId}
          />
        ))}
      <CommentPagiantion params={params} />
    </div>
  );
};

export default CommentFeed;
