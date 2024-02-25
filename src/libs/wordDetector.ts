import { vazir } from "@/pages/_app";

export function formatString(str: string) {
  // Regular expression patterns
  const hashtagPattern = /#[\w.-]+/g;
  const mentionPattern = /@[\w.-]+/g;
  const linkPattern = /https?:\/\/\S+/g;

  // Replace hashtags with spans
  const stringWithTags = str.replace(
    hashtagPattern,
    '<span class="text-sky-500">$&</span>'
  );

  // Replace usernames with spans
  const stringWithUsernames = stringWithTags.replace(
    mentionPattern,
    '<span class="text-sky-500 font-semibold mx-1 ">$&</span>'
  );

  // Replace links with anchor tags
  const stringWithLinks = stringWithUsernames.replace(
    linkPattern,
    '<a href="$&" class="text-sky-500 font-semibold">$&</a>'
  );

  return stringWithLinks;
}
export function formatNumbersWithCommas(inputString: string) {
  return inputString.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, function (match) {
    return match + ",";
  });
}
// todo => add language based direction and font to tweets
export function getStringDirectionality(str: string): {
  dir: "rtl" | "ltr";
  className: string;
} {
  const persianRegex = /[\u0600-\u06FF]/;
  const englishRegex = /[a-zA-Z]/;

  const persianLength = str.match(persianRegex)?.length || 0;
  const englishLength = str.match(englishRegex)?.length || 0;

  if (persianLength > englishLength) {
    return {
      dir: "rtl",
      className: "text-right text-wrap " + vazir.className,
    };
  } else if (englishLength > persianLength) {
    return {
      dir: "ltr",
      className: "text-left",
    };
  } else {
    // If the string contains both English and Persian characters with the same length,
    // we can use a heuristic to determine the directionality based on the first character.
    // For example, we can assume that the string is in the direction of the first character.
    const dir = persianRegex.test(str.charAt(0)) ? "rtl" : "ltr";
    return {
      dir: dir as "ltr" | "rtl",
      className:
        dir === "ltr" ? "text-left" : "text-right text-wrap " + vazir.className,
    };
  }
}
