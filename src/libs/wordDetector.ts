export function formatString(str: string) {
  // Regular expression patterns
  const linkPattern = /https?:\/\/\S+/g;
  const usernamePattern = /@(\w+)/g;
  const hashtagPattern = /#(\w+)/g;

  // Replace links with anchor tags
  const stringWithLinks = str.replace(
    linkPattern,
    '<a href="$&" class="text-sky-500 font-semibold">$&</a>'
  );

  // Replace usernames with spans
  const stringWithUsernames = stringWithLinks.replace(
    usernamePattern,
    '<span class="text-sky-500 font-semibold mx-1">@$1</span>'
  );

  // Replace hashtags with spans
  const stringWithTags = stringWithUsernames.replace(
    hashtagPattern,
    '<span class="text-sky-500">#$1</span>'
  );

  return stringWithTags;
}
export function formatNumbersWithCommas(inputString: string) {
  return inputString.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, function (match) {
    return match + ",";
  });
}
// todo => add language based direction and font to tweets
export function getStringDirectionality(str: string) {
  const persianRegex = /[\u0600-\u06FF]/;
  const englishRegex = /[a-zA-Z]/;

  const persianLength = str.match(persianRegex)?.length || 0;
  const englishLength = str.match(englishRegex)?.length || 0;

  if (persianLength > englishLength) {
    return "rtl";
  } else if (englishLength > persianLength) {
    return "ltr";
  } else {
    // If the string contains both English and Persian characters with the same length,
    // we can use a heuristic to determine the directionality based on the first character.
    // For example, we can assume that the string is in the direction of the first character.
    return persianRegex.test(str.charAt(0)) ? "rtl" : "ltr";
  }
}
