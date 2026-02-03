export const TextCode = {
  TEXT: 401,
  CHOICE: 102,
  SCROLLING_TEXT: 405
} as const;

export type TextCode = typeof TextCode[keyof typeof TextCode];

