import React from "react";
import Avatar from "../shared/Avatar";

const MutualReplies = ({
  replies,
}: {
  replies: {
    user: {
      id: string;
      name: string | null;
      username: string | null;
    };
    id: string;
    postId: string;
    body: string;
    createdAt: Date;
  }[];
}) => {
  return (
    <div className="min-w-full flex items-center justify-start ps-5 gap-4 ">
      {replies.length === 1 && (
        <div className="min-w-full flex items-start justify-start gap-3">
          <Avatar
            userId={replies[0].user.id}
            className="w-[55px] h-[55px] min-w-[55px] max-h-[55px] max-w-[55px] min-h-[55px] border-neutral-300 border-[1px] border-opacity-50"
          />
          <div className="w-fit flex flex-col items-start justify-start gap-2">
            <div className="w-fit flex items-center justify-start gap-2 ">
              <p className="text-zinc-300 text-sm font-bold leading-[14px]">
                {replies[0].user.name}
              </p> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutualReplies;
