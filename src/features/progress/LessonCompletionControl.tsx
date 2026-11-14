import { useProgress } from "./useProgress";

export function LessonCompletionControl({
  lessonSlug,
}: {
  lessonSlug: string;
}) {
  const { isLessonCompleted, markLessonCompleted, markLessonIncomplete } =
    useProgress();
  const completed = isLessonCompleted(lessonSlug);

  return (
    <section
      aria-label="Lesson completion"
      className="my-6 flex flex-col gap-3 border-y border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-700" role="status">
        {completed
          ? "Marked complete. You can reopen this lesson at any time."
          : "Finished this lesson? Mark it complete when you are ready."}
      </p>
      {completed ? (
        <button
          type="button"
          onClick={() => markLessonIncomplete(lessonSlug)}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-300"
        >
          Mark as incomplete
        </button>
      ) : (
        <button
          type="button"
          onClick={() => markLessonCompleted(lessonSlug)}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300"
        >
          Mark lesson complete
        </button>
      )}
    </section>
  );
}
