import React, { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { Swiper, SwiperSlide } from "swiper/react";
import useMedias from "@/hooks/useMedias";
import Loader from "../shared/Loader";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import usePost from "@/hooks/usePost";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useLoginModal } from "@/hooks/useLoginModal";
import useLike from "@/hooks/useLike";
import { BiRepost } from "react-icons/bi";
import useBookmark from "@/hooks/useBookmark";
import { FiShare } from "react-icons/fi";

const MediaSlider = ({
  postId,
  collapse,
  setCollapse,
}: {
  postId?: string;
  collapse: boolean;
  setCollapse: (val: boolean) => void;
}) => {
  const { Medias, isLoading } = useMedias(postId);
  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({
    postId: postId,
    userId: currentUser?.id,
  });
  const { toggleBookmark, BookmarkIcon } = useBookmark(currentUser?.id);
  const loginModal = useLoginModal();
  const { post, isLoading: postLoading } = usePost(postId);
  const router = useRouter();
  const onLike = useCallback(
    async (ev: any) => {
      ev.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      toggleLike();
    },
    [loginModal, currentUser, toggleLike]
  );

  const onRepost = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!currentUser || !post) {
        loginModal.onOpen();
      }

      if (post?.id) router.push(`/repost/${post.id}`);
    },
    [loginModal, currentUser, post]
  );

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
  return (
    <div
      className={twMerge(
        " col-span-12 md:col-span-7 lg:col-span-9 min-h-screen  flex flex-col justify-center items-center relative z-10 transition-all duration-100",
        collapse ? "md:col-span-12 lg:col-span-12" : ""
      )}
    >
      {isLoading ? (
        <Loader message="loading Tweet Media" />
      ) : (
        <Swiper
          className="min-w-[100%] max-w-[100%] md:min-w-[70%] md:max-w-[70%]  max-h-[90vh] pt-10"
          slidesPerView={1}
        >
          {Medias?.map((media) => (
            <SwiperSlide
              className="relative aspect-video flex items-center min-w-full justify-center overflow-hidden  "
              key={media.id}
            >
              <Image
                alt={media.description || ""}
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={media.url}
                className="object-contain w-full h-full"
                src={media.url}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {isLoading ? (
        <Loader message="loading statistics" size={10} />
      ) : (
        <div
          className={twMerge(
            "min-w-[100%] max-w-[100%] md:min-w-[70%] md:max-w-[70%] flex flex-row justify-between items-center p-6 bg-black fixed md:static bottom-0 left-0 z-30 text-[20px] gap-5 sm:gap-10 text-[#728291]"
          )}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/reply/${post.id}`);
            }}
            className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
          >
            <AiOutlineMessage size={20} />

            <p className="text-[20px]">{post.commentIds.length || 0}</p>
          </div>
          <div
            onClick={onLike}
            className="flex flex-row items-center gap-2 cursor-pointer transition-all hover:text-red-500"
          >
            <LikeIcon color={hasLiked ? "red" : ""} size={20} />
            <p className="text-[20px]">{post.likedIds.length}</p>
          </div>
          <div onClick={onRepost} className={twMerge("hover:text-sky-400  ")}>
            <BiRepost size={25} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <BookmarkIcon size={20} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigator.share({
                title: post.user.name + " tweet; " + post.body,
                url: `/posts/${post.id}`,
              });
            }}
            className={twMerge("hover:text-sky-400  ")}
          >
            <FiShare size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSlider;
