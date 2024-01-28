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
import { formatString } from "@/libs/wordDetector";
import { getHashtags, getMentions } from "@/libs/getMentions";
import { useRouter } from "next/router";
import MentionsList from "../lists/MentionsList";

const createPostSchema = z.object({
  body: z
    .string({
      required_error: "content cannot be empty!",
    })
    .min(5, "minimum characters must be 5"),
  mentionIds: z.array(z.string()),
});

const CreatePost = ({
  placeholder,
  isComment = false,
  postId,
  mainPage = false,
}: {
  mainPage?: boolean;
  postId?: string;
  isComment?: boolean;
  placeholder?: string;
}) => {
  const router = useRouter();

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId as string);
  const [isLoading, setLoading] = useState(false);

  const [mentions, setMentions] = useState<
    {
      id: string | undefined;
      username: String;
    }[]
  >([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      body: "",
      mentionIds: [],
    },
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof createPostSchema>) => {
      try {
        setLoading(true);
        let url = isComment ? `/api/comments?post_id=${postId}` : "/api/posts";
        await axios
          .post(url, {
            body: values.body,
            hashtags,
            mentions: values.mentionIds,
          })
          .then((res: any) => {
            mutatePosts();
            mutatePost();
            toast.success(res.data.message);
            form.reset();
            if (mainPage) {
              router.push("/");
            }
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
        <div className="flex flex-row gap-4 text-white">
          <div>
            <Avatar userId={currentUser?.id} />
          </div>
          <div className="max-w-full overflow-hidden w-full flex items-start justify-start gap-3 flex-col pb-2">
            {mainPage && (
              <p
                className="min-w-full p-2  text-left to-emerald-50 text-white font-semibold"
                dangerouslySetInnerHTML={{
                  __html: formatString(form.watch("body")),
                }}
              ></p>
            )}
            <textarea
              disabled={isLoading}
              aria-placeholder={placeholder}
              onChange={(event) => {
                form.setValue("body", event.target.value);
                setMentions(
                  getMentions(event.target.value).map((mention) => {
                    return { id: "", username: mention };
                  })
                );
                setHashtags(getHashtags(event.target.value));
              }}
              maxLength={100}
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
            text-white max-w-full overflow-hidden
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
            <div className="mt-4 flex flex-row justify-end w-full ">
              <Button
                disabled={isLoading || !(form.watch("body").length > 5)}
                onClick={onSubmit}
              >
                Tweet
              </Button>
            </div>
            {mainPage && hashtags.length > 0 && (
              <div className="min-w-full flex flex-row items-center justify-start gap-3 capitalize">
                <h4 className="capitalize w-fit text-sm whitespace-nowrap font-semibold">
                  hashTags :
                </h4>
                <div className="min-w-full flex items-start justify-start flex-wrap gap-2">
                  {hashtags.map((h) => (
                    <span
                      key={h}
                      className="px-3 py-2 rounded-md drop-shadow-2xl border-[1px] border-sky-400 text-sky-400 text-sm font-semibold capitalize"
                    >
                      #{h}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {mainPage && mentions.length > 0 && (
              <MentionsList
                mentions={mentions}
                onChange={(val) => {
                  const ids = val.map((v) => v.id) as never[];
                  form.setValue("mentionIds", ids);
                }}
              />
            )}
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
