/** The six boards of the Roll, in the order they are shown (the API ranks them). */
export const BOARD_IDS = ["stage", "week", "ascensions", "essences", "achievements", "descents"] as const;

export type BoardId = (typeof BOARD_IDS)[number];
