import { lessons, lessonBySlug } from "@/features/learning/curriculum";

import {
  emptyProgress,
  parseProgressData,
  PROGRESS_STORAGE_KEY,
  type CompletedLessonRecord,
  type ProgressSnapshot,
  type StoredProgress,
} from "./progressData";

type Listener = () => void;

const listeners = new Set<Listener>();
let snapshot: ProgressSnapshot = {
  data: emptyProgress,
  storageNotice: null,
};
let initialized = false;
let lastStoredValue: string | null = null;
let storageListenerRegistered = false;

function notify() {
  for (const listener of listeners) listener();
}

function readStoredValue(): { value: string | null; error: boolean } {
  try {
    return {
      value: window.localStorage.getItem(PROGRESS_STORAGE_KEY),
      error: false,
    };
  } catch {
    return { value: null, error: true };
  }
}

function refreshFromStorage() {
  const { value: raw, error } = readStoredValue();
  lastStoredValue = raw;
  const parsed = parseProgressData(raw);
  snapshot = {
    data: error ? snapshot.data : parsed.data,
    storageNotice: error
      ? "Browser storage is unavailable. Progress changes will remain only until you leave this page."
      : parsed.storageNotice,
  };
}

function handleStorage(event: StorageEvent) {
  if (
    event.key !== null &&
    event.key !== PROGRESS_STORAGE_KEY &&
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

function persist(data: StoredProgress) {
  let notice: string | null = null;
  let storedValue: string | null = null;
  let saved = false;
  try {
    storedValue = JSON.stringify(data);
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, storedValue);
    saved = true;
  } catch {
    notice =
      "Browser storage could not save this update. Progress changes will remain only until you leave this page.";
  }
  if (saved) lastStoredValue = storedValue;
  snapshot = { data, storageNotice: notice };
  notify();
}

export function getProgressSnapshot(): ProgressSnapshot {
  initialize();
  if (typeof window !== "undefined" && initialized) {
    const { value: storedValue, error } = readStoredValue();
    if (error) {
      if (!snapshot.storageNotice?.startsWith("Browser storage")) {
        snapshot = {
          data: snapshot.data,
          storageNotice:
            "Browser storage is unavailable. Progress changes will remain only until you leave this page.",
        };
      }
    } else if (storedValue !== lastStoredValue) {
      lastStoredValue = storedValue;
      const parsed = parseProgressData(storedValue);
      snapshot = {
        data: parsed.data,
        storageNotice: parsed.storageNotice,
      };
    }
  }
  return snapshot;
}

export function subscribeToProgress(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markLessonCompleted(
  lessonSlug: string,
  completedAt = new Date().toISOString(),
) {
  if (!lessonBySlug(lessonSlug)) {
    throw new Error(`Cannot complete unknown lesson "${lessonSlug}".`);
  }
  if (!Number.isFinite(Date.parse(completedAt))) {
    throw new Error("Completion time must be a valid date.");
  }
  const current = getProgressSnapshot().data.completedLessons;
  if (current.some((record) => record.lessonSlug === lessonSlug)) return;

  const record: CompletedLessonRecord = {
    lessonSlug,
    completedAt: new Date(completedAt).toISOString(),
  };
  persist({
    version: 1,
    completedLessons: [...current, record],
  });
}

export function markLessonIncomplete(lessonSlug: string) {
  if (!lessonBySlug(lessonSlug)) {
    throw new Error(`Cannot reopen unknown lesson "${lessonSlug}".`);
  }
  const current = getProgressSnapshot().data.completedLessons;
  if (!current.some((record) => record.lessonSlug === lessonSlug)) return;
  persist({
    version: 1,
    completedLessons: current.filter(
      (record) => record.lessonSlug !== lessonSlug,
    ),
  });
}

export function clearProgress() {
  persist({
    version: 1,
    completedLessons: [],
  });
}

export function isLessonCompleted(
  lessonSlug: string,
  records: CompletedLessonRecord[] = getProgressSnapshot().data
    .completedLessons,
) {
  return records.some((record) => record.lessonSlug === lessonSlug);
}

export function getKnownLessons() {
  return lessons;
}
