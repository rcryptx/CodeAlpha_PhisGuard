import { Link } from "react-router-dom";

import type { Lesson } from "@/features/learning/curriculum";

type LessonCardProps = {
  lesson: Lesson;
  number: number;
};

export function LessonCard({ lesson, number }: LessonCardProps) {
  return (
    <Link
      className="group flex min-h-40 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-700"
      to={`/learn/${lesson.slug}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          <span>Lesson {String(number).padStart(2, "0")}</span>
          <span>{lesson.category}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900 group-hover:underline group-hover:underline-offset-4">
          {lesson.title}
        </h3>
      </div>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
        Read lesson <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
