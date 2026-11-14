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

const STORAGE_UNAVAILABLE_NOTICE =
  "Browser storage is unavailable. Bookmarks and recently viewed terms will only last until you leave this page.";
const SAVE_FAILURE_NOTICE =
  "Browser storage could not save this update. Bookmarks and recently viewed terms will only last until you leave this page.";

const knownTermIds = new Set(glossaryTerms.map((term) => term.id));

interface StorageKeyOptions {
  key: string;
  label: string;
  limit?: number;
  serialize: (ids: string[]) => string;
}

const bookmarksOptions: StorageKeyOptions = {
  key: GLOSSARY_BOOKMARKS_KEY,
  label: "bookmarks",
  serialize: serializeBookmarks,
};

const recentOptions: StorageKeyOptions = {
  key: GLOSSARY_RECENT_KEY,
  label: "recently viewed terms",
  limit: MAX_RECENT_TERMS,
  serialize: serializeRecentTerms,
};

/**
 * In-memory state for a single storage key.
 *
 * `raw` always mirrors the value last observed in browser storage, so a later
 * snapshot read can tell an unpersisted in-memory change apart from a
 * successful save. `notice` carries the key's current problem (if any) and is
 * kept until that problem is actually resolved.
 */
interface StorageKeyState {
  ids: string[];
  raw: string | null;
  trusted: boolean;
  notice: string | null;
}

const listeners = new Set<Listener>();
let bookmarksState: StorageKeyState = {
  ids: [],
  raw: null,
  trusted: true,
  notice: null,
};
let recentState: StorageKeyState = {
  ids: [],
  raw: null,
  trusted: true,
  notice: null,
};
let snapshot: GlossaryStoreSnapshot = {
  bookmarkedIds: [],
  recentTermIds: [],
  storageNotice: null,
};
let initialized = false;
let storageListenerRegistered = false;

function notify() {
  for (const listener of listeners) listener();
}

function publish() {
  snapshot = {
    bookmarkedIds: bookmarksState.ids,
    recentTermIds: recentState.ids,
    storageNotice: bookmarksState.notice ?? recentState.notice,
  };
}

/**
 * Reads one key and derives its state without ever throwing. When the stored
 * value is unchanged the current state is returned untouched, which preserves
 * optimistic in-memory updates and their notices until storage really changes.
 */
function syncKey(
  options: StorageKeyOptions,
  current: StorageKeyState,
): StorageKeyState {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(options.key);
  } catch {
    return {
      ...current,
      trusted: false,
      notice: STORAGE_UNAVAILABLE_NOTICE,
    };
  }
  if (raw === current.raw) return current;
  const parsed = parseStoredIdList(raw, {
    label: options.label,
    limit: options.limit,
  });
  return {
    ids: parsed.ids,
    raw,
    trusted: parsed.trusted,
    notice: parsed.storageNotice,
  };
}

/**
 * Writes a single key. On success the cached raw value matches what was
 * actually persisted and any previous notice for that key is cleared. On
 * failure the previous raw value is retained, so a later snapshot read cannot
 * mistake the unpersisted change for a successful save, and the save-failure
 * notice stays visible until a save actually succeeds.
 */
function persistKey(
  options: StorageKeyOptions,
  current: StorageKeyState,
  ids: string[],
): StorageKeyState {
  let serialized: string;
  try {
    serialized = options.serialize(ids);
    window.localStorage.setItem(options.key, serialized);
  } catch {
    return { ...current, ids, notice: SAVE_FAILURE_NOTICE };
  }
  return { ids, raw: serialized, trusted: true, notice: null };
}

function refresh(changedKey?: string | null) {
  if (changedKey == null || changedKey === bookmarksOptions.key) {
    bookmarksState = syncKey(bookmarksOptions, bookmarksState);
  }
  if (changedKey == null || changedKey === recentOptions.key) {
    recentState = syncKey(recentOptions, recentState);
  }
  publish();
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
  refresh(event.key);
  notify();
}

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  refresh();
  if (!storageListenerRegistered) {
    window.addEventListener("storage", handleStorage);
    storageListenerRegistered = true;
  }
}

export function getGlossarySnapshot(): GlossaryStoreSnapshot {
  initialize();
  if (typeof window !== "undefined" && initialized) {
    const nextBookmarks = syncKey(bookmarksOptions, bookmarksState);
    const nextRecent = syncKey(recentOptions, recentState);
    if (nextBookmarks !== bookmarksState || nextRecent !== recentState) {
      bookmarksState = nextBookmarks;
      recentState = nextRecent;
      publish();
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

/** Writes only the bookmarks key; the recently viewed list is never touched. */
function setBookmarks(ids: string[]) {
  bookmarksState = persistKey(bookmarksOptions, bookmarksState, ids);
  publish();
  notify();
}

/** Writes only the recently viewed key; the bookmarks list is never touched. */
function setRecentTerms(ids: string[]) {
  recentState = persistKey(recentOptions, recentState, ids);
  publish();
  notify();
}

export function toggleBookmark(termId: string) {
  requireKnownTerm(termId, "bookmark");
  const { bookmarkedIds } = getGlossarySnapshot();
  const next = bookmarkedIds.includes(termId)
    ? bookmarkedIds.filter((id) => id !== termId)
    : [...bookmarkedIds, termId];
  setBookmarks(next);
}

export function clearBookmarks() {
  setBookmarks([]);
}

export function recordTermView(termId: string) {
  requireKnownTerm(termId, "record a view for");
  const { recentTermIds } = getGlossarySnapshot();
  const next = [
    termId,
    ...recentTermIds.filter((id) => id !== termId),
  ].slice(0, MAX_RECENT_TERMS);
  setRecentTerms(next);
}

export function clearRecentTerms() {
  setRecentTerms([]);
}

export function isTermBookmarked(
  termId: string,
  bookmarkedIds: string[] = getGlossarySnapshot().bookmarkedIds,
) {
  return bookmarkedIds.includes(termId);
}
