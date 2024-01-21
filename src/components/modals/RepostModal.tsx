import React, { useState } from "react";
import Modal from "./Modal";
import { useRepostModal } from "@/hooks/useRepostModal";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "../inputs/Input";
import Button from "../inputs/Button";
import TweetCard from "../cards/TweetCard";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePost from "@/hooks/usePost";
import { Post } from "@prisma/client";
import usePosts from "@/hooks/usePosts";

const RepostModal = () => {
  const [isLoading, setLoading] = useState(false);
  const [quote, setQuote] = useState("");

  const repostModal = useRepostModal();

  const { data: currentUser, mutate: userMutate } = useCurrentUser();
  const { post, mutate: postMutate } = usePost(repostModal.id);
  const { mutate: postsMutate } = usePosts();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (repostModal.id && currentUser) {
        await axios
          .post(`/api/repost`, {
            quote,
            userId: (post as Post).userId,
            tweetContent: (post as Post).body,
            postId: post.id,
          })
          .then((res) => {
            toast.success(res.data.message);
            postsMutate();
            setQuote("");
            userMutate();
            postMutate();
            repostModal.onClose();
          });
      } else {
        toast.error("please wait!");
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!repostModal.id || !repostModal.isOpen) {
    return null;
  }

  return (
    <Modal
      onClose={() => {
        setQuote("");
        repostModal.onClose();
      }}
      body={
        <form
          className="flex flex-col items-start justify-normal gap-2"
          onSubmit={onSubmit}
        >
          <Input
            name="quote"
            onChange={(e) => setQuote(e.target.value)}
            register={null}
            disabled={isLoading}
            label="Write a quote"
            placeholder="Optional"
            type="text"
            value={quote}
          />
          {!!post && !!currentUser && (
            <TweetCard post={post} userId={currentUser} />
          )}
          <Button disabled={isLoading} fullWidth type="submit">
            Repost
          </Button>
        </form>
      }
      disabled={isLoading}
      isOpen={repostModal.isOpen}
      title="Repost"
    />
  );
};

export default RepostModal;
