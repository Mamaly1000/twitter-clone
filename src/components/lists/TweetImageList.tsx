import useMedias from "@/hooks/useMedias";
import { useStatus } from "@/hooks/useStatus";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import MediaSkeletonCard from "../SkeletonCards/MediaSkeletonCard";

const TweetImageList = ({
  postId,
  className,
  hasMedia = false,
}: {
  hasMedia?: boolean;
  className?: string;
  postId: string;
}) => {
  const { Medias, isLoading } = useMedias(hasMedia ? postId : null);
  const statusModal = useStatus();
  if (hasMedia && isLoading) {
    return <MediaSkeletonCard />;
  }
  return (
    Medias.length > 0 && (
      <div
        onClick={(e) => {
          e.stopPropagation();
          statusModal.onOpen(postId);
        }}
        className={twMerge(
          "min-w-full mb-3 max-w-full h-auto grid grid-cols-2  rounded-lg overflow-hidden border-[1px] border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 items-start justify-start gap-1",
          Medias.length !== 3 && "grid-rows-2",
          Medias.length === 3 && "grid-rows-3",
          className
        )}
      >
        {Medias.length === 1 && (
          <div className="col-span-2 row-span-2 flex flex-col gap-0">
            <div className="relative bg-neutral-300 dark:bg-neutral-600  w-full aspect-video min-h-fit h-auto">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[0].url}
                alt=""
                src={Medias[0].url}
                layout="fill"
                className="object-cover w-full h-auto"
              />
            </div>
            {Medias[0].description && (
              <p className="px-3 pt-2 pb-5 text-[13px] text-[#d9d9d9] text-left capitalize">
                * {Medias[0].description}
              </p>
            )}
          </div>
        )}{" "}
        {Medias.length === 2 && (
          <>
            <div className="col-span-1 row-span-2 relative bg-neutral-300 dark:bg-neutral-600 min-w-full   h-auto  aspect-video">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[0].url}
                alt=""
                src={Medias[0].url}
                layout="fill"
                className="object-cover w-full"
              />
            </div>
            <div className="col-span-1 row-span-2 relative bg-neutral-300 dark:bg-neutral-600 min-w-full aspect-video">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[1].url}
                alt=""
                src={Medias[1].url}
                layout="fill"
                className="object-cover w-full"
              />
            </div>
          </>
        )}{" "}
        {Medias.length === 3 && (
          <>
            <div className="col-span-2 row-span-1 grid grid-cols-2 flex-row items-start justify-start gap-1">
              <div className="col-span-1   relative bg-neutral-300 dark:bg-neutral-600 min-w-full aspect-video  max-h-fit overflow-hidden">
                <Image
                  placeholder="blur"
                  loading="lazy"
                  blurDataURL={Medias[0].url}
                  alt=""
                  src={Medias[0].url}
                  layout="fill"
                  className="object-cover w-full max-h-fit"
                />
              </div>
              <div className="col-span-1   relative bg-neutral-300 dark:bg-neutral-600 min-w-full aspect-video  max-h-fit overflow-hidden  ">
                <Image
                  placeholder="blur"
                  loading="lazy"
                  blurDataURL={Medias[1].url}
                  alt=""
                  src={Medias[1].url}
                  layout="fill"
                  className="object-cover w-full"
                />
              </div>
            </div>
            <div className=" col-span-2 row-span-2 relative bg-neutral-300 dark:bg-neutral-600 min-w-full   aspect-video h-auto">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[2].url}
                alt=""
                src={Medias[2].url}
                layout="fill"
                className="object-cover w-full"
              />
            </div>
          </>
        )}{" "}
        {Medias.length === 4 && (
          <>
            <div className="col-span-1 row-span-1 relative bg-neutral-300 dark:bg-neutral-600 min-w-full   h-auto aspect-video">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[0].url}
                alt=""
                src={Medias[0].url}
                layout="fill"
                className="object-cover w-full"
              />
            </div>

            <div className="col-span-1 row-span-1 relative bg-neutral-300 dark:bg-neutral-600 min-w-full   h-auto aspect-video">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[1].url}
                alt=""
                src={Medias[1].url}
                layout="fill"
                className="object-cover w-full"
              />
            </div>

            <div className="col-span-1 row-span-1 relative bg-neutral-300 dark:bg-neutral-600 min-w-full  h-auto aspect-video ">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[2].url}
                alt=""
                src={Medias[2].url}
                layout="fill"
                className="object-cover w-full"
              />
            </div>

            <div className="col-span-1 row-span-1 relative bg-neutral-300 dark:bg-neutral-600 min-w-full h-auto aspect-video  ">
              <Image
                placeholder="blur"
                loading="lazy"
                blurDataURL={Medias[3].url}
                alt=""
                src={Medias[3].url}
                layout="fill"
                className="object-cover w-full"
              />
            </div>
          </>
        )}
      </div>
    )
  );
};

export default TweetImageList;
