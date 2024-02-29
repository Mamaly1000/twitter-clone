import React, { ReactNode } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useCallback } from "react";
declare global {
  var cloudinary: any;
}
import { CiImageOn } from "react-icons/ci";
import Button from "./Button";
import { toast } from "react-toastify";

const ImageUpload = ({
  onChange,
  length = 1,
  disable,
  children,
}: {
  children?: ReactNode;
  disable?: boolean;
  length?: number;
  onChange: (value: string) => void;
}) => {
  const handleUpload = useCallback(
    (results: any) => {
      onChange(results.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="qghlzgov"
      options={{
        maxFiles: length,
        styles: {
          palette: {
            window: "#000000",
            sourceBg: "#000000",
            windowBorder: "#8E9FBF",
            tabIcon: "#FFFFFF",
            inactiveTabIcon: "#8E9FBF",
            menuIcons: "#2AD9FF",
            link: "#08C0FF",
            action: "#336BFF",
            inProgress: "#00BFFF",
            complete: "#33ff00",
            error: "#EA2727",
            textDark: "#000000",
            textLight: "#FFFFFF",
          },
        },
        resourceType: "image",
        clientAllowedFormats: ["webp", "png", "jpeg"],
        sources: ["url", "local", "camera"],
      }}
      onError={(error: any) => {
        toast.error(error?.status);
      }}
    >
      {({ open }) => {
        return children ? (
          <section
            onClick={() => {
              if (!disable) {
                open?.();
              } else {
                toast.warning("please wait");
              }
            }}
            className="w-fit h-fit cursor-pointer p-0 m-0 "
          >
            {children}
          </section>
        ) : (
          <Button
            className="max-w-[34px] min-w-[34px] min-h-[34px] max-h-[34px] flex items-center justify-center p-[1px] border-none hover:bg-sky-500 hover:bg-opacity-30 rounded-full"
            onClick={() => {
              open?.();
            }}
            disabled={disable}
            secondary
          >
            <CiImageOn size={25} className="text-sky-500  " />
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
