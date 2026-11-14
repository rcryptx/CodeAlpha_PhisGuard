import { flashcards } from "./flashcardData";
import type { CardStatusMap } from "./flashcardProgress";
import type { StudyStatus } from "./types";

export const FLASHCARDS_SCHEMA_VERSION = 1;
export const FLASHCARDS_STORAGE_KEY = "phisguard.flashcard-progress";

/** A saved record for a single card. `unseen` is never stored. */
export interface CardStatusRecord {
  status: Exclude<StudyStatus, "unseen">;
  updatedAt: string;
}

export interface StoredFlashcardProgress {
  version: typeof FLASHCARDS_SCHEMA_VERSION;
  cards: Record<string, CardStatusRecord>;
}

export interface ParsedFlashcardProgress {
  data: StoredFlashcardProgress;
  storageNotice: string | null;
  /**
   * Whether the stored value was successfully interpreted and may therefore be
   * safely replaced. Unreadable or unsupported-version data is reported as
   * untrusted so callers can avoid overwriting data they do not understand.
   */
  trusted: boolean;
}

export const emptyFlashcardProgress: StoredFlashcardProgress = {
  version: FLASHCARDS_SCHEMA_VERSION,
  cards: {},
};

const knownCardIds = new Set(flashcards.map((card) => card.id));
const storableStatuses = new Set<CardStatusRecord["status"]>([
  "known",
  "revision",
]);

export function serializeFlashcardProgress(
  cards: Record<string, CardStatusRecord>,
): string {
  return JSON.stringify({
    version: FLASHCARDS_SCHEMA_VERSION,
    cards,
  } satisfies StoredFlashcardProgress);
}

/** Normalizes stored records into a plain card-id → status map. */
export function toCardStatusMap(
  progress: StoredFlashcardProgress,
): CardStatusMap {
  const statuses: CardStatusMap = {};
  for (const [cardId, record] of Object.entries(progress.cards)) {
    statuses[cardId] = record.status;
  }
  return statuses;
}

/**
 * Parses saved flashcard progress.
 *
 * Unknown card ids, invalid statuses, and malformed timestamps are dropped.
 * Unreadable or unsupported data yields empty progress plus a human-readable
 * notice rather than throwing, and the original browser value is left
 * untouched.
 */
export function parseFlashcardProgress(
  raw: string | null,
): ParsedFlashcardProgress {
  if (raw === null) {
    return { data: emptyFlashcardProgress, storageNotice: null, trusted: true };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      data: emptyFlashcardProgress,
      storageNotice:
        "Saved flashcard progress could not be read, so this page is starting empty. Existing browser data was left unchanged.",
      trusted: false,
    };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("version" in parsed) ||
    (parsed as { version?: unknown }).version !== FLASHCARDS_SCHEMA_VERSION ||
    !("cards" in parsed) ||
    typeof (parsed as { cards?: unknown }).cards !== "object" ||
    (parsed as { cards?: unknown }).cards === null ||
    Array.isArray((parsed as { cards?: unknown }).cards)
  ) {
    return {
      data: emptyFlashcardProgress,
      storageNotice:
        "Saved flashcard progress uses an unsupported format, so this page is starting empty. The stored data was left unchanged.",
      trusted: false,
    };
  }

  let discarded = 0;
  const cards: Record<string, CardStatusRecord> = {};
  for (const [cardId, value] of Object.entries(
    (parsed as { cards: Record<string, unknown> }).cards,
  )) {
    if (
      !knownCardIds.has(cardId) ||
      typeof value !== "object" ||
      value === null ||
      !("status" in value) ||
      typeof value.status !== "string" ||
      !storableStatuses.has(value.status as CardStatusRecord["status"]) ||
      !("updatedAt" in value) ||
      typeof value.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(value.updatedAt))
    ) {
      discarded += 1;
      continue;
    }
    cards[cardId] = {
      status: value.status as CardStatusRecord["status"],
      updatedAt: new Date(value.updatedAt).toISOString(),
    };
  }

  return {
    data: { version: FLASHCARDS_SCHEMA_VERSION, cards },
    storageNotice:
      discarded > 0
        ? `${discarded} invalid saved flashcard entr${discarded === 1 ? "y was" : "ies were"} ignored.`
        : null,
    trusted: true,
  };
}
