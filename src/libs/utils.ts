export function isBase64Image(imageData?: string | null) {
  if (!!imageData) {
    const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData);
  }
}
export const getShortUnit = (unit: string) =>
  ({
    minute: "m",
    minutes: "m",
    hour: "h",
    hours: "h",
    second: "s",
    seconds: "s",
    month: "mo",
    months: "mo",
    year: "y",
    years: "y",
  }[unit] || unit);
