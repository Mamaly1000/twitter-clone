import { useUploadedImages } from "@/hooks/useUploadedImages";
import Image from "next/image";
import React from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import Button from "../inputs/Button";
import { RxCross2 } from "react-icons/rx";
import { without } from "lodash";

export interface MediaType {
  url: string;
  desc?: string;
}

const UploadedImagesForm = () => {
  const Images = useUploadedImages();

  return (
    Images.images.length > 0 && (
      <div className="min-w-full max-w-full flex flex-row overflow-x-auto overflow-y-hidden min-h-[200px] gap-2 items-start justify-start pb-3">
        {Images.images.map((image) => (
          <div
            key={image.url}
            className="min-w-[200px] min-h-[200px] max-h-[200px] overflow-hidden rounded-lg border-[1px] border-neutral-800 relative"
          >
            <Image
              unoptimized
              src={image.url}
              alt=""
              fill
              className="w-fit object-cover rounded-lg min-w-[100px]"
            />
            <div className="absolute top-2 right-2 flex items-center justify-end gap-2">
              <Button
                className="  w-10 h-10 rounded-lg flex items-center justify-center p-1 max-w-10"
                secondary
                onClick={() => Images.onSelect(image)}
              >
                <HiMenuAlt2 size={15} />
              </Button>{" "}
              <Button
                className="  w-10 h-10 rounded-lg flex items-center justify-center p-1 max-w-10"
                secondary
                onClick={() => Images.onRemove(without(Images.images, image))}
              >
                <RxCross2 size={15} />
              </Button>{" "}
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default UploadedImagesForm;
