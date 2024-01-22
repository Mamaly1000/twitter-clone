export function formatString(str: string) {
  const hashtagRegex = /#(\w+)/g;
  const usernameRegex = /@(\w+)/g;

  const formattedStr = str.replace(
    hashtagRegex,
    '<span class="text-sky-500">#$1</span>'
  );
  const finalStr = formattedStr.replace(
    usernameRegex,
    '<span class="text-sky-500">@$1</span>'
  );

  return finalStr;
}
