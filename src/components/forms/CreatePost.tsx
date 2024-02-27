import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import usePosts, { PostsType } from "@/hooks/usePosts";
import { useRegisterModal } from "@/hooks/useRegisterModal";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Avatar from "../shared/Avatar";
import Button from "../inputs/Button";
import usePost from "@/hooks/usePost";
import { formatString, getStringDirectionality } from "@/libs/wordDetector";
import { getHashtags, getMentions } from "@/libs/getMentions";
import { useRouter } from "next/router";
import MentionsList from "../lists/MentionsList";
import ImageUpload from "../inputs/ImageInput";
import { useUploadedImages } from "@/hooks/useUploadedImages";
import UploadedImagesForm from "./UploadedImagesForm";
import CircularProgressBar from "../ui/CircularProgressBar";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { twMerge } from "tailwind-merge";
import EmojiWidget from "./EmojiWidget";
const createPostSchema = z.object({
  body: z.string().optional(),
  mentionIds: z.array(z.string()),
});

const CreatePost = ({
  placeholder,
  isComment = false,
  postId,
  mainPage = false,
  isRepost = false,
  params,
}: {
  params?: { id?: string; type?: PostsType; postId?: string };
  isRepost?: boolean;
  mainPage?: boolean;
  postId?: string;
  isComment?: boolean;
  placeholder?: string;
}) => {
  const [ref, { height }] = useMeasure();

  const router = useRouter();
  const Images = useUploadedImages();

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser, mutate: currentUserMutate } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts({
    id: params?.id,
    type: params?.type,
  });
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
      mentionIds: [] as string[],
    },
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof createPostSchema>) => {
      if (isRepost) {
        try {
          setLoading(true);
          if (currentUser) {
            await axios
              .post(`/api/repost`, {
                quote: values.body?.trim(),
                postId: postId,
                hashtags,
                mentions: values.mentionIds,
                medias: Images.images,
              })
              .then((res) => {
                toast.success(res.data.message);
                currentUserMutate();
                mutatePosts();
                mutatePost();
                form.reset();
                setHashtags([]);
                setMentions([]);
                Images.onRemove([]);
                router.push(`/posts/${res.data.repostId}`);
              });
          }
        } catch (error: any) {
          if (error.response.data.message) {
            toast.error(error.response.data.message);
          }
        } finally {
          setLoading(false);
        }
      }
      if (!!!isComment && !!!isRepost) {
        try {
          setLoading(true);
          let url = "/api/posts";
          await axios
            .post(url, {
              body: values.body?.trim(),
              hashtags,
              mentions: values.mentionIds,
              medias: Images.images,
            })
            .then((res: any) => {
              mutatePosts();
              mutatePost();
              toast.success(res.data.message);
              form.reset();
              setHashtags([]);
              Images.onRemove([]);
              setMentions([]);

              if (mainPage) {
                if (mainPage && !!postId) {
                  router.push(`/posts/${res.data.comment.parentId}`);
                } else router.push("/");
              }
            });
        } catch (error) {
          console.log(error);
          toast.error("something went wrong!");
        } finally {
          setLoading(false);
        }
      }
      if (isComment) {
        try {
          setLoading(true);
          let url = `/api/comments?post_id=${postId}`;
          await axios
            .post(url, {
              body: values.body?.trim(),
              hashtags,
              mentions: values.mentionIds,
              medias: Images.images,
            })
            .then((res: any) => {
              mutatePosts();
              mutatePost();
              toast.success(res.data.message);
              form.reset();
              setHashtags([]);
              Images.onRemove([]);
              setMentions([]);

              if (mainPage) {
                if (mainPage && !!postId) {
                  router.push(`/posts/${res.data.comment.parentId}`);
                } else router.push("/");
              }
            });
        } catch (error) {
          console.log(error);
          toast.error("something went wrong!");
        } finally {
          setLoading(false);
        }
      }
    }
  );

  const onChange = useCallback(
    (event: any) => {
      form.setValue("body", event.target.value);
      setMentions(
        getMentions(event.target.value).map((mention) => {
          return { id: "", username: mention };
        })
      );
      setHashtags(getHashtags(event.target.value));
    },
    [form, setMentions, getMentions, setHashtags, getHashtags]
  );

  const direction = useMemo(() => {
    return getStringDirectionality(form.watch("body"));
  }, [form.watch("body"), onChange]);

  return (
    <motion.div
      animate={{ height: height + 20 }}
      className="border-b-[1px] border-neutral-800 px-5 py-3  relative z-10"
    >
      {currentUser ? (
        <motion.div
          ref={ref}
          className="flex flex-col justify-start items-start gap-4 text-white   py-2"
        >
          <div className="min-w-full max-w-full flex items-start justify-start gap-4">
            <div>
              <Avatar userId={currentUser?.id} />
            </div>
            <div className="max-w-full w-full flex items-start justify-start gap-3 flex-col pb-2">
              <motion.p
                style={{
                  direction: direction.dir,
                }}
                className={twMerge(
                  "min-w-full p-2 to-emerald-50 text-white font-semibold",
                  direction.className
                )}
                dangerouslySetInnerHTML={{
                  __html: formatString(form.watch("body")),
                }}
                key={form.watch("body")}
              ></motion.p>
              <textarea
                style={{
                  direction: direction.dir,
                }}
                disabled={isLoading}
                aria-placeholder={placeholder}
                onChange={onChange}
                value={form.watch("body")}
                className={twMerge(
                  "disabled:opacity-80 peer resize-none mt-3 w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white max-w-full overflow-hidden  placeholder:capitalize",
                  direction.className
                )}
                maxLength={400}
                placeholder={placeholder}
              ></textarea>
              <hr className="peer-focus:w-full w-[0px] bg-sky-500 border-none h-[1.4px] transition-all duration-500" />
              <div className="mt-4 flex flex-row justify-end w-full gap-4 relative">
                <Button
                  disabled={
                    isLoading ||
                    !(form.watch("body").length > 5 || Images.images.length > 0)
                  }
                  onClick={onSubmit}
                >
                  Tweet
                </Button>
                <ImageUpload
                  onChange={(val) => {
                    if (Images.images.length >= 4) {
                      toast.error("max image length is 4");
                    } else {
                      Images.onAdd([...Images.images, { url: val }]);
                    }
                  }}
                  length={4}
                  disable={Images.images.length >= 4 || isLoading}
                />
                <EmojiWidget
                  onChange={(val) => {
                    form.setValue("body", form.watch("body") + " " + val);
                  }}
                />
                <CircularProgressBar
                  currentValue={form.watch("body").length}
                  limit={400}
                />
              </div>
            </div>
          </div>
          <MentionsList
            mentions={mentions}
            onChange={(val) => {
              const ids = val.map((v) => v.id) as never[];
              form.setValue("mentionIds", ids);
            }}
          />
          <UploadedImagesForm />
        </motion.div>
      ) : (
        <div ref={ref} className="py-8">
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
    </motion.div>
  );
};

export default CreatePost;
