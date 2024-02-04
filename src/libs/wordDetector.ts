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
