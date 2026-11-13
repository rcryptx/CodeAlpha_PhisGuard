import { useSyncExternalStore } from "react";

import {
  clearProgress,
  getProgressSnapshot,
  isLessonCompleted,
  markLessonCompleted,
  markLessonIncomplete,
  subscribeToProgress,
} from "./progressStore";

export function useProgress() {
  const snapshot = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getProgressSnapshot,
  );

  return {
    completedLessons: snapshot.data.completedLessons,
    storageNotice: snapshot.storageNotice,
    isLessonCompleted: (lessonSlug: string) =>
      isLessonCompleted(lessonSlug, snapshot.data.completedLessons),
    markLessonCompleted,
    markLessonIncomplete,
    clearProgress,
  };
}
