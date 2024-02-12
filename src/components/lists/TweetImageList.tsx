import useMedias from "@/hooks/useMedias";
import Image from "next/image";
import React from "react";

const TweetImageList = ({ postId }: { postId: string }) => {
  const { Medias } = useMedias(postId);
  return (
    Medias.length > 0 && (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="min-w-full mb-3 max-w-full min-h-[100px]   grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden border-[1px] border-neutral-800 hover:border-neutral-500 items-start justify-start gap-1"
      >
        {Medias.length === 1 && (
          <div className="col-span-2 row-span-2 flex flex-col gap-0">
            <div className="relative bg-neutral-600 min-w-full   min-h-[300px] max-h-[300px]">
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
            {Medias[0].description && (
              <p className="px-3 pt-2 pb-5 text-[13px] text-[#d9d9d9] text-left">
                {Medias[0].description}
              </p>
            )}
          </div>
        )}{" "}
        {Medias.length === 2 && (
          <>
            <div className="col-span-1 row-span-2 flex flex-col gap-0">
              <div className="relative bg-neutral-600 min-w-full  min-h-[100px] max-h-[300px] ">
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
            </div>
            <div className="col-span-1 row-span-2 flex flex-col gap-0  ">
              <div className="relative bg-neutral-600 min-w-full    min-h-[100px] max-h-[300px]">
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
          </>
        )}{" "}
        {Medias.length === 3 && (
          <>
            <div className="col-span-1 row-span-1 flex flex-col gap-0    ">
              <div className="relative bg-neutral-600 min-w-full   min-h-[100px] max-h-[300px]">
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
            </div>
            <div className="col-span-1 row-span-1 flex flex-col gap-0">
              <div className="relative bg-neutral-600 min-w-full min-h-[100px] max-h-[300px]  ">
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
            </div>{" "}
            <div className="col-span-2 row-span-1 flex flex-col gap-0 ">
              <div className="relative bg-neutral-600 min-w-full   min-h-[100px] max-h-[300px]">
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
            </div>
          </>
        )}{" "}
        {Medias.length === 4 && (
          <>
            <div className="col-span-1 row-span-1 flex flex-col gap-0">
              <div className="relative bg-neutral-600 min-w-full   min-h-[100px] max-h-[300px]">
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
            </div>
            <div className="col-span-1 row-span-1 flex flex-col gap-0">
              <div className="relative bg-neutral-600 min-w-full   min-h-[100px] max-h-[300px]">
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
            </div>{" "}
            <div className="col-span-1 row-span-1 flex flex-col gap-0">
              <div className="relative bg-neutral-600 min-w-full  min-h-[100px] max-h-[300px] ">
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
            </div>{" "}
            <div className="col-span-1 row-span-1 flex flex-col gap-0">
              <div className="relative bg-neutral-600 min-w-full min-h-[100px] max-h-[300px]  ">
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
            </div>
          </>
        )}
      </div>
    )
  );
};

export default TweetImageList;
