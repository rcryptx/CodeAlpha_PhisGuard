import type { StudyStatus } from "./types";

/** A normalized map from card id to the learner's saved study status. */
export type CardStatusMap = Record<string, StudyStatus>;

export interface DeckProgress {
  total: number;
  known: number;
  revision: number;
  unseen: number;
  /** Percentage of cards marked known, rounded to a whole number. */
  masteryPercentage: number;
}

/**
 * Counts how a deck's cards have been marked. A card is "unseen" when it has
 * no saved status of "known" or "revision".
 */
export function getDeckProgress(
  cardIds: string[],
  statuses: CardStatusMap,
): DeckProgress {
  let known = 0;
  let revision = 0;
  for (const cardId of cardIds) {
    const status = statuses[cardId];
    if (status === "known") known += 1;
    else if (status === "revision") revision += 1;
  }
  const total = cardIds.length;
  const unseen = Math.max(0, total - known - revision);
  return {
    total,
    known,
    revision,
    unseen,
    masteryPercentage: total === 0 ? 0 : Math.round((known / total) * 100),
  };
}

/**
 * Returns a new array in a shuffled order using the Fisher–Yates algorithm.
 * The `random` parameter is injectable so callers (and tests) can supply a
 * deterministic sequence.
 */
export function shuffleIds(
  ids: string[],
  random: () => number = Math.random,
): string[] {
  const result = [...ids];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
