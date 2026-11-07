import { useMemo, useState } from "react";

import { LessonCard } from "@/components/learning/LessonCard";
import { PageMetadata } from "@/components/seo/PageMetadata";
import { lessonCategories, lessons } from "@/features/learning/curriculum";

export function LearnPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredLessons = useMemo(
    () =>
      lessons.filter((lesson) =>
        `${lesson.title} ${lesson.category} ${lesson.introduction}`
          .toLocaleLowerCase()
          .includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  return (
    <>
      <PageMetadata
        title="Learning centre"
        description="Build practical phishing-awareness skills with beginner-friendly lessons on suspicious messages, account security, safe browsing, and reporting."
        path="/learn"
      />
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            The learning centre
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Learn to spot the signal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A practical, beginner-friendly curriculum for recognizing phishing,
            protecting accounts, and responding with confidence. Choose a lesson
            and learn at your own pace.
          </p>
          <div
            className="mt-7 flex flex-wrap gap-3 text-sm text-slate-600"
            aria-label="Curriculum overview"
          >
            <span className="rounded-full border border-slate-300 px-3 py-1">
              {lessons.length} lessons
            </span>
            <span className="rounded-full border border-slate-300 px-3 py-1">
              {lessonCategories.length} topic areas
            </span>
            <span className="rounded-full border border-slate-300 px-3 py-1">
              Beginner friendly
            </span>
          </div>
        </header>

        <section aria-labelledby="curriculum-heading" className="py-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2
                id="curriculum-heading"
                className="text-2xl font-semibold tracking-tight text-slate-900"
              >
                Explore the curriculum
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Search by topic or browse lessons in any order.
              </p>
            </div>
            <div className="w-full sm:max-w-sm">
              <label
                htmlFor="lesson-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search lessons
              </label>
              <input
                id="lesson-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “email” or “password”"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
        </section>

        {filteredLessons.length === 0 ? (
          <p
            className="rounded-xl border border-dashed border-slate-300 p-6 text-slate-600"
            role="status"
          >
            No lessons match “{query}”. Try a different topic.
          </p>
        ) : (
          <div className="space-y-10">
            {lessonCategories.map((category) => {
              const categoryLessons = filteredLessons.filter(
                (lesson) => lesson.category === category.name,
              );
              if (!categoryLessons.length) return null;

              return (
                <section
                  key={category.name}
                  aria-labelledby={`category-${category.name.toLowerCase()}`}
                >
                  <div className="mb-4 border-b border-slate-200 pb-3">
                    <h2
                      id={`category-${category.name.toLowerCase()}`}
                      className="text-xl font-semibold text-slate-900"
                    >
                      {category.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {category.description}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {categoryLessons.map((lesson) => (
                      <LessonCard
                        key={lesson.slug}
                        lesson={lesson}
                        number={lessons.indexOf(lesson) + 1}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
