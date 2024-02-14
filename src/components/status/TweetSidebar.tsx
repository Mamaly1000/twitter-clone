import React from "react";
import { twMerge } from "tailwind-merge";
import TweetCard from "../cards/TweetCard";
import CommentFeed from "../lists/CommentFeed";
import usePost from "@/hooks/usePost";
import Loader from "../shared/Loader";
import useCurrentUser from "@/hooks/useCurrentUser";
import Button from "../inputs/Button";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import CreatePost from "../forms/CreatePost";

const TweetSidebar = ({
  postId,
  collapse,
  setCollapse,
}: {
  collapse: boolean;
  setCollapse: (val: boolean) => void;
  postId?: string;
}) => {
  const { post, isLoading } = usePost(postId);
  const { data: user, isLoading: userLoading } = useCurrentUser();

  if (isLoading || userLoading || !post || !user) return <Loader />;

  return (
    <>
      <div
        className={twMerge(
          "relative hidden lg:block z-20 min-h-screen sm:max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-70px)] lg:max-h-screen overflow-y-auto overflow-x-visible bg-black lg:col-span-5 border-l-[1px] border-neutral-800 2xl:col-span-3"
        )}
      >
        {isLoading || userLoading ? (
          <Loader size={15} message="loading tweet data" />
        ) : (
          <>
            <TweetCard status isComment post={post} />
            <CreatePost
              isComment
              postId={post.id}
              mainPage
              placeholder="what is your reply?"
            />
            <CommentFeed
              postId={post.id}
              author={post.user.username!}
              comments={post?.comments}
              userId={user.id}
            />
          </>
        )}
      </div>
      <div
        className={twMerge(
          "absolute top-0 ring-0 lg:hidden z-30 min-h-screen max-h-screen overflow-auto sm:max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-70px)] overflow-y-auto bg-black transition-all min-w-full",
          !collapse ? "translate-x-[1000px] opacity-0" : "translate-x-0 opacity-100"
        )}
      >
        <Button
          className={twMerge(
            "w-10 max-w-10 h-10 rounded-lg flex justify-center items-center p-1 absolute top-3 right-3 z-20",
            collapse ? "rotate-180" : ""
          )}
          secondary
          onClick={() => {
            setCollapse(false);
          }}
        >
          <MdOutlineKeyboardDoubleArrowRight size={15} className="text-white" />
        </Button>
        {isLoading || userLoading ? (
          <Loader size={15} message="loading tweet data" />
        ) : (
          <>
            <TweetCard status isComment post={post} />
            <CreatePost
              isComment
              postId={post.id}
              mainPage
              placeholder="what is your reply?"
            />
            <CommentFeed
              postId={post.id}
              author={post.user.username!}
              comments={post?.comments}
              userId={user.id}
            />
          </>
        )}
      </div>
    </>
  );
};

export default TweetSidebar;
