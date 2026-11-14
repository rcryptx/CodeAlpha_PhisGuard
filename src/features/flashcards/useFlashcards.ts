import { useSyncExternalStore } from "react";

import {
  getCardStatus,
  getFlashcardSnapshot,
  markCardStatus,
  resetAllFlashcardProgress,
  resetCard,
  resetDeck,
  subscribeToFlashcards,
} from "./flashcardStore";

export function useFlashcards() {
  const snapshot = useSyncExternalStore(
    subscribeToFlashcards,
    getFlashcardSnapshot,
    getFlashcardSnapshot,
  );

  return {
    statuses: snapshot.statuses,
    storageNotice: snapshot.storageNotice,
    getCardStatus: (cardId: string) => getCardStatus(cardId, snapshot.statuses),
    markCardStatus,
    resetCard,
    resetDeck,
    resetAllFlashcardProgress,
  };
}
