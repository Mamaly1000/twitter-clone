import React from "react";
import { Comment } from "@prisma/client";
import CommentCard from "../cards/CommentCard";

const CommentFeed = ({ comments }: { comments?: Comment[] }) => {
  if (comments?.length === 0) {
    <div className="text-neutral-600 text-center p-6 text-xl">No Replies</div>;
  }
  return (
    <div className="min-w-full flex flex-col items-start justify-start gap-0 p-0 m-0">
      {comments?.map((comment) => (
        <CommentCard comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentFeed;
