import { useSyncExternalStore } from "react";

import {
  clearBookmarks,
  clearRecentTerms,
  getGlossarySnapshot,
  isTermBookmarked,
  recordTermView,
  subscribeToGlossary,
  toggleBookmark,
} from "./glossaryStore";

export function useGlossary() {
  const snapshot = useSyncExternalStore(
    subscribeToGlossary,
    getGlossarySnapshot,
    getGlossarySnapshot,
  );

  return {
    bookmarkedIds: snapshot.bookmarkedIds,
    recentTermIds: snapshot.recentTermIds,
    storageNotice: snapshot.storageNotice,
    isBookmarked: (termId: string) =>
      isTermBookmarked(termId, snapshot.bookmarkedIds),
    toggleBookmark,
    clearBookmarks,
    recordTermView,
    clearRecentTerms,
  };
}
