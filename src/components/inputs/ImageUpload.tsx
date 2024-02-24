import { useUploadThing } from "@/hooks/useUploadThing";
import { isBase64Image } from "@/libs/utils";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Loader from "../shared/Loader";
import { toast } from "react-toastify";
import { handleImage } from "@/libs/handleImage";
const ImageUpload = ({
  value,
  disabled,
  onChange,
  label,
}: {
  value: string;
  disabled?: boolean;
  onChange: (base64: string) => void;
  label: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [base64, setBase64] = useState<string>(value);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      handleImage(acceptedFiles, (val: string) => setBase64(val));
    },
    [setFiles, handleImage, setBase64]
  );

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      toast.success("uploaded successfully!");
    },
    onUploadError: () => {
      toast.error("error occurred while uploading");
    },
    onUploadBegin: () => {
      toast.info("upload has begun");
    },
  });

  const fileTypes = ["image/jpeg", "image/png", "image/webp"];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: 1,
    disabled,
  });

  const handleChange = useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange]
  );

  return (
    <div className="min-w-full flex items-start justify-start gap-3 flex-col">
      <div
        {...getRootProps({
          className:
            "w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700 cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        {files.length > 0 || base64 ? (
          <div className="flex items-center justify-center flex-col gap-2">
            <Image
              src={base64}
              unoptimized={true}
              height="100"
              width="100"
              alt="Uploaded image"
            />
          </div>
        ) : (
          <p className="text-white">{label}</p>
        )}
      </div>
      <div className="flex items-center justify-start gap-2">
        {files.length > 0 && (
          <button
            className="px-3 capitalize disabled:cursor-not-allowed disabled:opacity-50 py-2 rounded-md text-white border-white border-[1px] flex items-center justify-center gap-2"
            onClick={async () => {
              const hasImageChanged = isBase64Image(base64);
              if (hasImageChanged) {
                const imgRes = await startUpload(files);
                if (imgRes && imgRes[0].url) {
                  onChange(imgRes[0].url);
                }
              }
            }}
            disabled={isUploading}
          >
            {!isUploading ? "upload" : "uploading"}{" "}
            {!!isUploading && (
              <Loader
                className="max-h-[30px] max-w-[30px] min-h-[30px] min-w-[30px]"
                size={10}
              />
            )}
          </button>
        )}
        {base64 && (
          <button
            className="px-3 capitalize disabled:cursor-not-allowed disabled:opacity-50 py-2 rounded-md text-white border-white border-[1px] flex items-center justify-center gap-2"
            onClick={async () => {
              onChange(base64);
              toast.success("picture saved");
            }}
            disabled={isUploading}
          >
            embed file
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
