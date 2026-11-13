import { glossaryTerms } from "./terms";
import {
  GLOSSARY_BOOKMARKS_KEY,
  GLOSSARY_RECENT_KEY,
  MAX_RECENT_TERMS,
  parseStoredIdList,
  serializeBookmarks,
  serializeRecentTerms,
} from "./glossaryStorage";

type Listener = () => void;

export interface GlossaryStoreSnapshot {
  bookmarkedIds: string[];
  recentTermIds: string[];
  storageNotice: string | null;
}

const knownTermIds = new Set(glossaryTerms.map((term) => term.id));

const listeners = new Set<Listener>();
let snapshot: GlossaryStoreSnapshot = {
  bookmarkedIds: [],
  recentTermIds: [],
  storageNotice: null,
};
let initialized = false;
let lastBookmarksValue: string | null = null;
let lastRecentValue: string | null = null;
let storageListenerRegistered = false;

function notify() {
  for (const listener of listeners) listener();
}

function readStored(key: string): { value: string | null; error: boolean } {
  try {
    return { value: window.localStorage.getItem(key), error: false };
  } catch {
    return { value: null, error: true };
  }
}

function readBoth() {
  const bookmarks = readStored(GLOSSARY_BOOKMARKS_KEY);
  const recent = readStored(GLOSSARY_RECENT_KEY);
  return { bookmarks, recent, error: bookmarks.error || recent.error };
}

function refreshFromStorage() {
  const { bookmarks, recent, error } = readBoth();
  lastBookmarksValue = bookmarks.value;
  lastRecentValue = recent.value;
  const parsedBookmarks = parseStoredIdList(bookmarks.value, {
    label: "bookmarks",
  });
  const parsedRecent = parseStoredIdList(recent.value, {
    label: "recently viewed terms",
    limit: MAX_RECENT_TERMS,
  });
  snapshot = {
    bookmarkedIds: error ? snapshot.bookmarkedIds : parsedBookmarks.ids,
    recentTermIds: error ? snapshot.recentTermIds : parsedRecent.ids,
    storageNotice: error
      ? "Browser storage is unavailable. Bookmarks and recently viewed terms will only last until you leave this page."
      : (parsedBookmarks.storageNotice ?? parsedRecent.storageNotice),
  };
}

function handleStorage(event: StorageEvent) {
  if (
    event.key !== null &&
    event.key !== GLOSSARY_BOOKMARKS_KEY &&
    event.key !== GLOSSARY_RECENT_KEY &&
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

function persist(bookmarkedIds: string[], recentTermIds: string[]) {
  let notice: string | null = null;
  let bookmarksValue: string | null = null;
  let recentValue: string | null = null;
  let saved = false;
  try {
    bookmarksValue = serializeBookmarks(bookmarkedIds);
    recentValue = serializeRecentTerms(recentTermIds);
    window.localStorage.setItem(GLOSSARY_BOOKMARKS_KEY, bookmarksValue);
    window.localStorage.setItem(GLOSSARY_RECENT_KEY, recentValue);
    saved = true;
  } catch {
    notice =
      "Browser storage could not save this update. Bookmarks and recently viewed terms will only last until you leave this page.";
  }
  if (saved) {
    lastBookmarksValue = bookmarksValue;
    lastRecentValue = recentValue;
  }
  snapshot = { bookmarkedIds, recentTermIds, storageNotice: notice };
  notify();
}

export function getGlossarySnapshot(): GlossaryStoreSnapshot {
  initialize();
  if (typeof window !== "undefined" && initialized) {
    const { bookmarks, recent, error } = readBoth();
    if (error) {
      if (!snapshot.storageNotice?.startsWith("Browser storage")) {
        snapshot = {
          ...snapshot,
          storageNotice:
            "Browser storage is unavailable. Bookmarks and recently viewed terms will only last until you leave this page.",
        };
      }
    } else if (
      bookmarks.value !== lastBookmarksValue ||
      recent.value !== lastRecentValue
    ) {
      lastBookmarksValue = bookmarks.value;
      lastRecentValue = recent.value;
      const parsedBookmarks = parseStoredIdList(bookmarks.value, {
        label: "bookmarks",
      });
      const parsedRecent = parseStoredIdList(recent.value, {
        label: "recently viewed terms",
        limit: MAX_RECENT_TERMS,
      });
      snapshot = {
        bookmarkedIds: parsedBookmarks.ids,
        recentTermIds: parsedRecent.ids,
        storageNotice:
          parsedBookmarks.storageNotice ?? parsedRecent.storageNotice,
      };
    }
  }
  return snapshot;
}

export function subscribeToGlossary(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function requireKnownTerm(termId: string, action: string) {
  if (!knownTermIds.has(termId)) {
    throw new Error(`Cannot ${action} unknown glossary term "${termId}".`);
  }
}

export function toggleBookmark(termId: string) {
  requireKnownTerm(termId, "bookmark");
  const { bookmarkedIds, recentTermIds } = getGlossarySnapshot();
  const next = bookmarkedIds.includes(termId)
    ? bookmarkedIds.filter((id) => id !== termId)
    : [...bookmarkedIds, termId];
  persist(next, recentTermIds);
}

export function clearBookmarks() {
  const { recentTermIds } = getGlossarySnapshot();
  persist([], recentTermIds);
}

export function recordTermView(termId: string) {
  requireKnownTerm(termId, "record a view for");
  const { bookmarkedIds, recentTermIds } = getGlossarySnapshot();
  const next = [
    termId,
    ...recentTermIds.filter((id) => id !== termId),
  ].slice(0, MAX_RECENT_TERMS);
  persist(bookmarkedIds, next);
}

export function clearRecentTerms() {
  const { bookmarkedIds } = getGlossarySnapshot();
  persist(bookmarkedIds, []);
}

export function isTermBookmarked(
  termId: string,
  bookmarkedIds: string[] = getGlossarySnapshot().bookmarkedIds,
) {
  return bookmarkedIds.includes(termId);
}
