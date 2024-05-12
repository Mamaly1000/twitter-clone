import useMedias from "@/hooks/useMedias";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../shared/Loader";
import { twMerge } from "tailwind-merge";
import DraggableComponent from "../ui/DragComponent";

const MediaSlider = ({
  postId,
  className,
  handleClose,
}: {
  className?: string;
  postId?: string;
  handleClose: () => void;
}) => {
  const { Medias, isLoading } = useMedias(postId);

  return Medias.length === 0 || isLoading ? (
    <Loader message="loading Tweet Media" />
  ) : (
    <DraggableComponent
      className="w-full "
      onDragEnd={(_e, i) => {
        if (i.offset.y > 200 || i.offset.y < -200) {
          handleClose();
        }
      }}
    >
      <Swiper
        className={twMerge("w-full h-full pt-10", className)}
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
            {!!media.description && (
              <p className="min-w-full text-sm capitalize font-bold text-text-primary dark:text-[#d9d9d9] absolute bottom-0 left-0 p-2 bg-light dark:bg-black border-b-[1px] border-neutral-300 dark:border-neutral-800">
                * {media.description}
              </p>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </DraggableComponent>
  );
};

export default MediaSlider;
