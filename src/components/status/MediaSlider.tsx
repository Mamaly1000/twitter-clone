import useMedias from "@/hooks/useMedias";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../shared/Loader";

const MediaSlider = ({ postId }: { postId?: string }) => {
  const { Medias, isLoading } = useMedias(postId);

  return Medias.length === 0 || isLoading ? (
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
          {!!media.description && (
            <p className="min-w-full text-sm capitalize font-bold text-[#d9d9d9] absolute bottom-0 left-0 p-2 bg-black border-b-[1px] border-neutral-800">
              * {media.description}
            </p>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MediaSlider;
