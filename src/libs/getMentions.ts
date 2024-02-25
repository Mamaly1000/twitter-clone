export function getMentions(text: string) {
  const regex = /@([\w.-]+)/g;
  const mentions = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const mention = match[1];
    mentions.push(mention);
  }

  return mentions;
}
export function getHashtags(text: string) {
  const regex = /#[a-zA-Z0-9.-_]+/g;
  const hashtags = text.match(regex);
  return hashtags ? hashtags.map((tag) => tag.slice(1)) : [];
}
