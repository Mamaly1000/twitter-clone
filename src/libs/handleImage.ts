import { isBase64Image } from "./utils";

export const handleImage = (
  files: File[],
  fieldChange: (val: string) => void
) => {
  const filereader = new FileReader();
  if (files && files.length > 0) {
    const file = files[0];
    // if(onchange)
    // onChange(Array.from(e.target.files));
    if (!file.type.includes("image")) return;
    filereader.onload = async (e) => {
      const imageDataUrl = e.target?.result?.toString() || "";
      if (!!isBase64Image(imageDataUrl)) {
        fieldChange(imageDataUrl);
      }
    };
    filereader.readAsDataURL(file);
  }
};
