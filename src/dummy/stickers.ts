const stickers = [
  { id: 1, sticker: "😀" },
  { id: 2, sticker: "😁" },
  { id: 3, sticker: "😂" },
  { id: 4, sticker: "🤣" },
  { id: 5, sticker: "😃" },
  { id: 6, sticker: "😄" },
  { id: 7, sticker: "😅" },
  { id: 8, sticker: "😆" },
  { id: 9, sticker: "😇" },
  { id: 10, sticker: "😈" },
  { id: 11, sticker: "😉" },
  { id: 12, sticker: "😊" },
  { id: 13, sticker: "😋" },
  { id: 14, sticker: "😎" },
  { id: 15, sticker: "😍" },
  { id: 16, sticker: "😘" },
  { id: 17, sticker: "😗" },
  { id: 18, sticker: "😙" },
  { id: 19, sticker: "😚" },
  { id: 20, sticker: "��� media8" },
  { id: 21, sticker: "😐" },
  { id: 22, sticker: "😑" },
  { id: 23, sticker: "😶" },
  { id: 24, sticker: "😒" },
  { id: 25, sticker: "😞" },
  { id: 26, sticker: "😟" },
  { id: 27, sticker: "😠" },
  { id: 28, sticker: "😡" },
  { id: 29, sticker: "😢" },
  { id: 30, sticker: "😣" },
  { id: 31, sticker: "😤" },
  { id: 32, sticker: "😥" },
  { id: 33, sticker: "😨" },
  { id: 34, sticker: "😰" },
  { id: 35, sticker: "😱" },
  { id: 36, sticker: "😲" },
  { id: 37, sticker: "😴" },
  { id: 38, sticker: "😪" },
  { id: 39, sticker: "😵" },
  { id: 40, sticker: "😷" },
  { id: 41, sticker: "😸" },
  { id: 42, sticker: "😹" },
  { id: 43, sticker: "😻" },
  { id: 44, sticker: "😼" },
  { id: 45, sticker: "😽" },
  { id: 46, sticker: "😾" },
  { id: 47, sticker: "😿" },
  { id: 48, sticker: "🙀" },
  { id: 49, sticker: "🙁" },
  { id: 50, sticker: "🙅" },
  { id: 51, sticker: "🙆" },
  { id: 52, sticker: "🙇" },
  { id: 53, sticker: "🙈" },
  { id: 54, sticker: "🙉" },
  { id: 55, sticker: "🙊" },
  { id: 56, sticker: "🙋" },
  { id: 57, sticker: "🙎" },
  { id: 58, sticker: "🙍" },
  { id: 59, sticker: "🙎‍♂️" },
  { id: 60, sticker: "🙍‍♀️" },
  { id: 61, sticker: "🙅‍♂️" },
  { id: 62, sticker: "🙅‍♀️" },
  { id: 63, sticker: "🙇‍♂️" },
  { id: 64, sticker: "🙇‍♀️" },
  { id: 65, sticker: "🙈‍♂️" },
  { id: 66, sticker: "🙈‍♀️" },
  { id: 67, sticker: "🙉‍♂️" },
  { id: 68, sticker: "🙉‍♀️" },
  { id: 69, sticker: "🙊‍♂️" },
  { id: 70, sticker: "🙊‍♀️" },
  { id: 71, sticker: "🙋‍♂️" },
  { id: 72, sticker: "🙋‍♀️" },
  { id: 73, sticker: "🙎‍♂️" },
  { id: 74, sticker: "🙎‍♀️" },
  { id: 75, sticker: "🙍‍♂️" },
  { id: 76, sticker: "🙍‍♀️" },
  { id: 77, sticker: "💃" },
  { id: 78, sticker: "🕺" },
  { id: 79, sticker: "💁" },
  { id: 80, sticker: "💂" },
  { id: 81, sticker: "🙋‍♂️" },
  { id: 82, sticker: "🙋‍♀️" },
  { id: 83, sticker: "💆" },
  { id: 84, sticker: "🤵" },
  { id: 85, sticker: "👰" },
  { id: 86, sticker: "🕵" },
  { id: 87, sticker: "🦸" },
  { id: 88, sticker: "🦸‍♂️" },
  { id: 89, sticker: "🦸‍♀️" },
  { id: 90, sticker: "🤼" },
  { id: 91, sticker: "🤼‍♂️" },
  { id: 92, sticker: "🤼‍♀️" },
  { id: 93, sticker: "🤳" },
  { id: 94, sticker: "🤲" },
  { id: 95, sticker: "🙌" },
  { id: 96, sticker: "👐" },
  { id: 97, sticker: "🙏" },
  { id: 98, sticker: "✋" },
  { id: 99, sticker: "🖐" },
  { id: 100, sticker: "🤚" },
  { id: 101, sticker: "🖖" },
  { id: 102, sticker: "👋" },
  { id: 103, sticker: "🤝" },
  { id: 104, sticker: "🤞" },
  { id: 105, sticker: "🤠" },
  { id: 106, sticker: "🤛" },
  { id: 107, sticker: "🤜" },
  { id: 108, sticker: "🥊" },
  { id: 109, sticker: "🤠‍♂️" },
  { id: 110, sticker: "🤛‍♂️" },
  { id: 111, sticker: "🤜‍♂️" },
  { id: 112, sticker: "🥊‍♂️" },
  { id: 113, sticker: "🤠‍♀️" },
  { id: 114, sticker: "🤛‍♀️" },
  { id: 115, sticker: "🤜‍♀️" },
  { id: 116, sticker: "🥊‍♀️" },
  { id: 117, sticker: "💪" },
  { id: 118, sticker: "🦵" },
  { id: 119, sticker: "🦶" },
  { id: 120, sticker: "🦴" },
  { id: 121, sticker: "🦵‍♂️" },
  { id: 122, sticker: "🦵‍♀️" },
  { id: 123, sticker: "🦶‍♂️" },
  { id: 124, sticker: "🦶‍♀️" },
  { id: 125, sticker: "🦴‍♂️" },
  { id: 126, sticker: "🦴‍♀️" },
  { id: 127, sticker: "👣" },
  { id: 128, sticker: "👆" },
  { id: 129, sticker: "👇" },
  { id: 130, sticker: "🤏" },
  { id: 131, sticker: "🤙" },
  { id: 132, sticker: "🤘" },
  { id: 133, sticker: "🖐🤘" },
  { id: 134, sticker: "🤘🖐" },
  { id: 135, sticker: "🤘🤘" },
  { id: 136, sticker: "🖐🖐" },
  { id: 137, sticker: "🤘🖐🖐" },
  { id: 138, sticker: "🖐🤘🖐" },
  { id: 139, sticker: "🖐🖐🤘" },
  { id: 140, sticker: "🤘🤘🤘" },
  { id: 141, sticker: "🤘🤘🖐" },
  { id: 142, sticker: "🤘🖐🤘" },
  { id: 143, sticker: "🖐🤘🤘" },
  { id: 144, sticker: "🤘🖐🤘🖐" },
  { id: 145, sticker: "🖐🤘🤘🖐" },
  { id: 146, sticker: "🤘🖐🖐🤘" },
  { id: 147, sticker: "🖐🤘🤘🤘" },
  { id: 148, sticker: "🤘🤘🤘🤘" },
];
