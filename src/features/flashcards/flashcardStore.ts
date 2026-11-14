import { getFlashcard, getFlashcardDeck } from "./flashcardData";
import type { CardStatusMap } from "./flashcardProgress";
import {
  emptyFlashcardProgress,
  FLASHCARDS_STORAGE_KEY,
  parseFlashcardProgress,
  serializeFlashcardProgress,
  toCardStatusMap,
  type CardStatusRecord,
  type StoredFlashcardProgress,
} from "./flashcardStorage";
import type { StudyStatus } from "./types";

type Listener = () => void;

export interface FlashcardSnapshot {
  data: StoredFlashcardProgress;
  statuses: CardStatusMap;
  storageNotice: string | null;
}

const listeners = new Set<Listener>();
let snapshot: FlashcardSnapshot = {
  data: emptyFlashcardProgress,
  statuses: {},
  storageNotice: null,
};
let initialized = false;
let lastStoredValue: string | null = null;
let storageListenerRegistered = false;

function notify() {
  for (const listener of listeners) listener();
}

function buildSnapshot(
  data: StoredFlashcardProgress,
  storageNotice: string | null,
): FlashcardSnapshot {
  return { data, statuses: toCardStatusMap(data), storageNotice };
}

function readStoredValue(): { value: string | null; error: boolean } {
  try {
    return {
      value: window.localStorage.getItem(FLASHCARDS_STORAGE_KEY),
      error: false,
    };
  } catch {
    return { value: null, error: true };
  }
}

function refreshFromStorage() {
  const { value: raw, error } = readStoredValue();
  lastStoredValue = raw;
  const parsed = parseFlashcardProgress(raw);
  snapshot = buildSnapshot(
    error ? snapshot.data : parsed.data,
    error
      ? "Browser storage is unavailable. Flashcard progress will remain only until you leave this page."
      : parsed.storageNotice,
  );
}

function handleStorage(event: StorageEvent) {
  if (
    event.key !== null &&
    event.key !== FLASHCARDS_STORAGE_KEY &&
    event.storageArea !== null
  ) {
    return;
  }
  refreshFromStorage();
  notify();
}

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  refreshFromStorage();
  if (!storageListenerRegistered) {
    window.addEventListener("storage", handleStorage);
    storageListenerRegistered = true;
  }
}

function persist(cards: Record<string, CardStatusRecord>) {
  let notice: string | null = null;
  let storedValue: string | null = null;
  let saved = false;
  try {
    storedValue = serializeFlashcardProgress(cards);
    window.localStorage.setItem(FLASHCARDS_STORAGE_KEY, storedValue);
    saved = true;
  } catch {
    notice =
      "Browser storage could not save this update. Flashcard progress will remain only until you leave this page.";
  }
  if (saved) lastStoredValue = storedValue;
  const data: StoredFlashcardProgress = {
    version: emptyFlashcardProgress.version,
    cards,
  };
  snapshot = buildSnapshot(data, notice);
  notify();
}

export function getFlashcardSnapshot(): FlashcardSnapshot {
  initialize();
  if (typeof window !== "undefined" && initialized) {
    const { value: storedValue, error } = readStoredValue();
    if (error) {
      if (!snapshot.storageNotice?.startsWith("Browser storage")) {
        snapshot = buildSnapshot(
          snapshot.data,
          "Browser storage is unavailable. Flashcard progress will remain only until you leave this page.",
        );
      }
    } else if (storedValue !== lastStoredValue) {
      lastStoredValue = storedValue;
      const parsed = parseFlashcardProgress(storedValue);
      snapshot = buildSnapshot(parsed.data, parsed.storageNotice);
    }
  }
  return snapshot;
}

export function subscribeToFlashcards(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function requireKnownCard(cardId: string, action: string) {
  if (!getFlashcard(cardId)) {
    throw new Error(`Cannot ${action} unknown flashcard "${cardId}".`);
  }
}

export function markCardStatus(
  cardId: string,
  status: Exclude<StudyStatus, "unseen">,
  updatedAt = new Date().toISOString(),
) {
  requireKnownCard(cardId, "update");
  if (!Number.isFinite(Date.parse(updatedAt))) {
    throw new Error("Review time must be a valid date.");
  }
  const cards = { ...getFlashcardSnapshot().data.cards };
  cards[cardId] = {
    status,
    updatedAt: new Date(updatedAt).toISOString(),
  };
  persist(cards);
}

export function resetCard(cardId: string) {
  requireKnownCard(cardId, "reset");
  const current = getFlashcardSnapshot().data.cards;
  if (!(cardId in current)) return;
  const cards = { ...current };
  delete cards[cardId];
  persist(cards);
}

export function resetDeck(deckId: string) {
  if (!getFlashcardDeck(deckId)) {
    throw new Error(`Cannot reset unknown flashcard deck "${deckId}".`);
  }
  const current = getFlashcardSnapshot().data.cards;
  const cards: Record<string, CardStatusRecord> = {};
  let changed = false;
  for (const [cardId, record] of Object.entries(current)) {
    if (getFlashcard(cardId)?.deckId === deckId) {
      changed = true;
      continue;
    }
    cards[cardId] = record;
  }
  if (!changed) return;
  persist(cards);
}

export function resetAllFlashcardProgress() {
  persist({});
}

export function getCardStatus(
  cardId: string,
  statuses: CardStatusMap = getFlashcardSnapshot().statuses,
): StudyStatus {
  return statuses[cardId] ?? "unseen";
}
