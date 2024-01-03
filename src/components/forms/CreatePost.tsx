import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import usePosts from "@/hooks/usePosts";
import { useRegisterModal } from "@/hooks/useRegisterModal";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Avatar from "../shared/Avatar";
import Button from "../inputs/Button";
import usePost from "@/hooks/usePost";

const createPostSchema = z.object({
  body: z
    .string({
      required_error: "content cannot be empty!",
    })
    .min(5, "minimum characters must be 5"),
});

const CreatePost = ({
  placeholder,
  isComment = false,
  postId,
}: {
  postId?: string;
  isComment?: boolean;
  placeholder?: string;
}) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId as string);
  const [isLoading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      body: "",
    },
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof createPostSchema>) => {
      try {
        setLoading(true);
        let url = isComment ? `/api/comments?post_id=${postId}` : "/api/posts";
        await axios.post(url, values).then((res: any) => {
          mutatePosts();
          mutatePost();
          toast.success(res.data.message);
          form.reset();
        });
      } catch (error) {
        console.log(error);
        toast.error("something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  );

  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
      {currentUser ? (
        <div className="flex flex-row gap-4">
          <div>
            <Avatar userId={currentUser?.id} />
          </div>
          <div className="w-full">
            <textarea
              disabled={isLoading}
              aria-placeholder={placeholder}
              onChange={(event) => form.setValue("body", event.target.value)}
              value={form.watch("body")}
              className="
            disabled:opacity-80
            peer
            resize-none 
            mt-3 
            w-full 
            bg-black 
            ring-0 
            outline-none 
            text-[20px] 
            placeholder-neutral-500 
            text-white
          "
              placeholder={placeholder}
            ></textarea>
            <hr
              className="
            opacity-0 
            peer-focus:opacity-100 
            h-[1px] 
            w-full 
            border-neutral-800 
            transition"
            />
            <div className="mt-4 flex flex-row justify-end">
              <Button
                disabled={isLoading || !(form.watch("body").length > 5)}
                onClick={onSubmit}
              >
                Tweet
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h1 className="text-white text-2xl text-center mb-4 font-bold">
            Welcome to Twitter
          </h1>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button onClick={loginModal.onOpen}>Login</Button>
            <Button onClick={registerModal.onOpen} secondary>
              Register
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
