import { lessons } from "@/features/learning/curriculum";

export const PROGRESS_STORAGE_KEY = "phisguard.learning-progress";
export const PROGRESS_SCHEMA_VERSION = 1;
export const RECENT_ACTIVITY_WINDOW_DAYS = 7;

export interface CompletedLessonRecord {
  lessonSlug: string;
  completedAt: string;
}

export interface StoredProgress {
  version: typeof PROGRESS_SCHEMA_VERSION;
  completedLessons: CompletedLessonRecord[];
}

export interface ProgressSnapshot {
  data: StoredProgress;
  storageNotice: string | null;
}

export interface ProgressSummary {
  totalLessons: number;
  completedLessons: number;
  lessonsRemaining: number;
  completionPercentage: number;
  recentlyCompleted: CompletedLessonRecord[];
  completedInRecentWindow: number;
  lastActivityAt: string | null;
}

export const emptyProgress: StoredProgress = {
  version: PROGRESS_SCHEMA_VERSION,
  completedLessons: [],
};

const knownLessonSlugs = new Set(lessons.map((lesson) => lesson.slug));

export function parseProgressData(raw: string | null): ProgressSnapshot {
  if (raw === null) {
    return { data: emptyProgress, storageNotice: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      data: emptyProgress,
      storageNotice:
        "Saved learning progress could not be read, so this page is starting with empty progress. Existing browser data was left unchanged.",
    };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("version" in parsed) ||
    parsed.version !== PROGRESS_SCHEMA_VERSION
  ) {
    return {
      data: emptyProgress,
      storageNotice:
        "Saved learning progress uses an unsupported format. This page is starting with empty progress; the stored data was left unchanged.",
    };
  }

  if (
    !("completedLessons" in parsed) ||
    !Array.isArray(parsed.completedLessons)
  ) {
    return {
      data: emptyProgress,
      storageNotice:
        "Saved learning progress has an invalid lesson list. This page is starting with empty progress; the stored data was left unchanged.",
    };
  }

  let discardedRecords = 0;
  const records = new Map<string, CompletedLessonRecord>();
  for (const value of parsed.completedLessons) {
    if (
      typeof value !== "object" ||
      value === null ||
      !("lessonSlug" in value) ||
      typeof value.lessonSlug !== "string" ||
      !("completedAt" in value) ||
      typeof value.completedAt !== "string" ||
      !Number.isFinite(Date.parse(value.completedAt)) ||
      Date.parse(value.completedAt) > Date.now() ||
      !knownLessonSlugs.has(value.lessonSlug)
    ) {
      discardedRecords += 1;
      continue;
    }

    const previous = records.get(value.lessonSlug);
    if (
      !previous ||
      Date.parse(value.completedAt) > Date.parse(previous.completedAt)
    ) {
      records.set(value.lessonSlug, {
        lessonSlug: value.lessonSlug,
        completedAt: new Date(value.completedAt).toISOString(),
      });
    }
  }

  return {
    data: {
      version: PROGRESS_SCHEMA_VERSION,
      completedLessons: [...records.values()].sort((left, right) =>
        left.lessonSlug.localeCompare(right.lessonSlug),
      ),
    },
    storageNotice:
      discardedRecords > 0
        ? `${discardedRecords} invalid or outdated saved progress record${discardedRecords === 1 ? " was" : "s were"} ignored.`
        : null,
  };
}

export function getProgressSummary(
  progress: StoredProgress,
  now: number = Date.now(),
): ProgressSummary {
  const validRecords = new Map<string, CompletedLessonRecord>();
  for (const record of progress.completedLessons) {
    if (knownLessonSlugs.has(record.lessonSlug)) {
      validRecords.set(record.lessonSlug, record);
    }
  }

  const completedLessons = validRecords.size;
  const orderedRecords = [...validRecords.values()].sort(
    (left, right) =>
      Date.parse(right.completedAt) - Date.parse(left.completedAt),
  );
  const recentBoundary =
    now - RECENT_ACTIVITY_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return {
    totalLessons: lessons.length,
    completedLessons,
    lessonsRemaining: Math.max(0, lessons.length - completedLessons),
    completionPercentage:
      lessons.length === 0
        ? 0
        : Math.round((completedLessons / lessons.length) * 100),
    recentlyCompleted: orderedRecords.slice(0, 5),
    completedInRecentWindow: orderedRecords.filter(
      (record) => Date.parse(record.completedAt) >= recentBoundary,
    ).length,
    lastActivityAt: orderedRecords[0]?.completedAt ?? null,
  };
}
