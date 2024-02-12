import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useCallback } from "react";
declare global {
  var cloudinary: any;
}
import { IoImageOutline } from "react-icons/io5";
import Button from "./Button";

const ImageUpload = ({
  onChange,
  length = 1,
  disable,
}: {
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
      }}
      onError={(error) => {
        console.log(error);
      }}
    >
      {({ open }) => {
        return (
          <Button
            className="rounded-md max-w-full w-10 flex items-center justify-center p-[1px]   "
            onClick={() => {
              open?.();
            }}
            disabled={disable}
          >
            <IoImageOutline size={20} className="text-white" />
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
