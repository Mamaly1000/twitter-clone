export function isBase64Image(imageData?: string | null) {
  if (!!imageData) {
    const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData);
  }
}
