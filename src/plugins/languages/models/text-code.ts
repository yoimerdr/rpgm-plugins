/**
 * Event command codes for text-related commands in RPG Maker.
 * These codes identify Show Text, Show Choices, and Scroll Text commands in event data.
 */
export const TextCode = {
  /** Show Text command code (401) */
  TEXT: 401,
  /** Show Choices command code (102) */
  CHOICE: 102,
  /** Scroll Text command code (405) */
  SCROLLING_TEXT: 405
} as const;

/** Union type of all text command code values */
export type TextCode = typeof TextCode[keyof typeof TextCode];

