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
import { twMerge } from "tailwind-merge";
import EmojiWidget from "./EmojiWidget";
import useComments from "@/hooks/useComments";
import Image from "next/image";
import wellcomeImage from "../../../public/images/wellcomeImage.svg";
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
  const router = useRouter();
  const Images = useUploadedImages();

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser, mutate: currentUserMutate } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts({
    id: params?.id,
    type: params?.type,
  });
  const { mutate: commentsMutate } = useComments({ postId });
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

  const form_body = form.watch("body");

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof createPostSchema>) => {
      if (isRepost) {
        try {
          setLoading(true);
          if (currentUser) {
            await axios
              .post(`/api/repost`, {
                quote: !!(values?.body!.trim()?.length > 0)
                  ? values.body?.trim()
                  : undefined,
                postId: postId,
                hashtags,
                mentions: values.mentionIds,
                medias: Images.images.length > 0 ? Images.images : undefined,
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
              router.push("/");
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
              toast.success(res.data.message);
              commentsMutate();
              Images.onRemove([]);
              setHashtags([]);
              setMentions([]);
              form.reset();
              router.push(`/posts/${res.data.comment.parentId}`);
            });
        } catch (error: any) {
          if (error.response.data.message) {
            toast.error(error.response.data.message);
          } else toast.error("something went wrong!");
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
    return getStringDirectionality(form_body);
  }, [form_body, onChange]);

  const canTweet =
    isLoading || !(form_body.trim().length > 5 || Images.images.length > 0);

  return (
    <motion.div
      className={twMerge(
        "border-b-[1px] border-neutral-300 dark:border-neutral-800 relative z-20 max-w-full min-w-full",
        mainPage ? "hidden md:block" : ""
      )}
    >
      {currentUser ? (
        <motion.div className="flex flex-col justify-start items-start gap-1 text-text-primary dark:text-white  px-5 py-3">
          <div className="min-w-full max-w-full flex items-start justify-start gap-4 overflow-hidden">
            <div>
              <Avatar userId={currentUser?.id} />
            </div>
            <div className="max-w-full w-full flex items-start justify-start gap-3 flex-col pb-2">
              {form_body.length > 0 && (
                <motion.p
                  style={{
                    direction: direction.dir,
                  }}
                  className={twMerge(
                    "min-w-full p-2 to-emerald-50 text-text-primary dark:text-white font-semibold",
                    direction.className
                  )}
                  dangerouslySetInnerHTML={{
                    __html: formatString(form_body),
                  }}
                  key={form_body}
                ></motion.p>
              )}
              <textarea
                style={{
                  direction: direction.dir,
                }}
                disabled={isLoading}
                aria-placeholder={placeholder}
                onChange={onChange}
                value={form_body}
                className={twMerge(
                  "disabled:opacity-80   peer resize-none mt-3 w-full bg-light dark:bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-text-primary dark:text-white max-w-full overflow-hidden  placeholder:capitalize",
                  direction.className
                )}
                maxLength={300}
                placeholder={placeholder}
              ></textarea>
              <hr className="peer-focus:w-full w-[0px] bg-sky-500 border-none h-[1.4px] transition-all duration-500" />
            </div>
          </div>
          <hr className="min-w-full max-h-[1.3px] min-h-[1.3px] bg-neutral-300 dark:bg-neutral-800 border-none" />
          {/* tweet action bar */}
          <div className="flex items-center justify-between w-full gap-4 relative mt-1 z-10">
            <section className="max-w-fit flex items-center justify-start gap-1 flex-wrap">
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
                  form.setValue("body", form_body + " " + val);
                }}
              />
            </section>
            <section className="max-w-fit flex items-center justify-end gap-2 flex-wrap">
              {form_body.length > 0 && (
                <CircularProgressBar
                  size={25}
                  currentValue={form_body.length}
                  limit={300}
                />
              )}
              <Button disabled={canTweet} onClick={onSubmit}>
                Tweet
              </Button>
            </section>
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
        <div className="py-8 px-5 flex flex-col items-center justify-center gap-3">
          <h1 className="text-text-primary dark:text-white text-2xl text-center mb-4 font-bold">
            Welcome to{" "}
            <span className="text-sky-500 drop-shadow-2xl font-extrabold">
              Twitter
            </span>
          </h1>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button onClick={loginModal.onOpen}>Login</Button>
            <Button onClick={registerModal.onOpen} secondary>
              Register
            </Button>
          </div>
          <Image
            width={300}
            height={300}
            src={wellcomeImage.src}
            alt="wellcomeImage"
            className="pt-4"
          />
        </div>
      )}
    </motion.div>
  );
};

export default CreatePost;
