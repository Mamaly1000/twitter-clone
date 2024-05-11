import { useUploadedImages } from "@/hooks/useUploadedImages";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import Image from "next/image";
import Input from "../inputs/Input";
import { without } from "lodash";

const ImageDescription = () => {
  const uploadedImages = useUploadedImages();
  const [text, setText] = useState("");
  const body = (
    <div className="min-w-full max-w-full flex flex-col items-start justify-start gap-3">
      <div className="max-w-full  min-w-full mx-auto bg-neutral-500   relative overflow-hidden aspect-video">
        {uploadedImages.selectedImage && (
          <Image alt={text} fill src={uploadedImages.selectedImage?.url} />
        )}
      </div>
      <Input
        name="image description"
        onChange={(e) => setText(e.target.value)}
        placeholder="describe this photo... "
        value={text}
      />
    </div>
  );

  useEffect(() => {
    if (uploadedImages.selectedImage?.desc) {
      setText(uploadedImages.selectedImage?.desc);
    }
  }, [uploadedImages.selectedImage?.desc]);

  return (
    <Modal
      onClose={() => {
        uploadedImages.onReset();
        setText("");
      }}
      body={body}
      actionLabel="submit"
      isOpen={uploadedImages.isOpen}
      onSubmit={() => {
        if (uploadedImages.selectedImage && text.length > 5) {
          uploadedImages.onAdd([
            ...without(uploadedImages.images, uploadedImages.selectedImage),
            { url: uploadedImages.selectedImage.url, desc: text.trim() },
          ]);
          setText("");
          uploadedImages.onReset();
        }
      }}
      title="add description to image"
    />
  );
};

export default ImageDescription;
