import { Link, useParams } from "react-router-dom";

import { Breadcrumbs } from "@/components/learning/Breadcrumbs";
import { LessonNavigation } from "@/components/learning/LessonNavigation";
import { PageMetadata } from "@/components/seo/PageMetadata";
import { LessonCompletionControl } from "@/features/progress/LessonCompletionControl";
import { ProgressNotice } from "@/features/progress/ProgressNotice";
import { useProgress } from "@/features/progress/useProgress";
import {
  getLessonIndex,
  getRelatedLessons,
  lessons,
  lessonBySlug,
} from "@/features/learning/curriculum";

export function LessonPage() {
  const { slug = "" } = useParams();
  const lesson = lessonBySlug(slug);
  const { storageNotice } = useProgress();

  if (!lesson) {
    return (
      <>
        <PageMetadata
          title="Lesson not found"
          description="This learning lesson could not be found. Browse the PhisGuard cybersecurity learning curriculum."
          path={`/learn/${slug}`}
        />
        <section className="mx-auto max-w-2xl py-10">
          <Breadcrumbs
            items={[
              { label: "Learn", to: "/learn" },
              { label: "Lesson not found" },
            ]}
          />
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Lesson not found
          </h1>
          <p className="mt-4 text-slate-600">
            This lesson may have moved. Browse the curriculum to choose an
            available lesson.
          </p>
          <Link
            className="mt-6 inline-flex rounded-full border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            to="/learn"
          >
            Browse all lessons
          </Link>
        </section>
      </>
    );
  }

  const index = getLessonIndex(lesson.slug);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const relatedLessons = getRelatedLessons(lesson);

  return (
    <>
      <PageMetadata
        title={lesson.title}
        description={lesson.introduction}
        path={`/learn/${lesson.slug}`}
      />
      <article className="mx-auto max-w-4xl">
        <ProgressNotice message={storageNotice} />
        <Breadcrumbs
          items={[
            { label: "Learn", to: "/learn" },
            { label: lesson.category, to: "/learn" },
            { label: lesson.title },
          ]}
        />

        <header className="border-b border-slate-200 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {lesson.category} · Lesson {String(index + 1).padStart(2, "0")} of{" "}
            {lessons.length}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            {lesson.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {lesson.introduction}
          </p>
        </header>

        <LessonCompletionControl lessonSlug={lesson.slug} />

        <section
          aria-labelledby="objectives-heading"
          className="my-8 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2
            id="objectives-heading"
            className="text-lg font-semibold text-slate-900"
          >
            By the end of this lesson
          </h2>
          <ul className="mt-4 space-y-3">
            {lesson.objectives.map((objective) => (
              <li
                key={objective}
                className="flex gap-3 text-sm leading-6 text-slate-700"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500"
                />
                {objective}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-9">
          {lesson.explanations.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-7 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.points && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <aside className="my-9 rounded-2xl border-l-4 border-slate-400 bg-slate-100 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            {lesson.example.label}
          </h2>
          <p className="mt-3 leading-7 text-slate-800">{lesson.example.text}</p>
        </aside>

        <div className="grid gap-8 border-t border-slate-200 py-8 md:grid-cols-2">
          <section aria-labelledby="warning-signs-heading">
            <h2
              id="warning-signs-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Warning signs to check
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {lesson.warningSigns.map((sign) => (
                <li key={sign} className="flex gap-3">
                  <span aria-hidden="true">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="prevention-heading">
            <h2
              id="prevention-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Practical prevention
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {lesson.prevention.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span aria-hidden="true">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          aria-labelledby="takeaways-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2
            id="takeaways-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Key takeaways
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {lesson.takeaways.map((takeaway) => (
              <li key={takeaway} className="flex gap-3">
                <span aria-hidden="true">✓</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {relatedLessons.length > 0 && (
          <section aria-labelledby="related-heading" className="py-8">
            <h2
              id="related-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Continue exploring
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {relatedLessons.map((related) => (
                <li key={related.slug}>
                  <Link
                    className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    to={`/learn/${related.slug}`}
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {lesson.references.length > 0 && (
          <section
            aria-labelledby="references-heading"
            className="border-t border-slate-200 py-6"
          >
            <h2
              id="references-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Further reading
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              External guidance from cybersecurity agencies:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              {lesson.references.map((reference) => (
                <li key={reference.url}>
                  <a
                    className="text-slate-700 underline decoration-slate-400 underline-offset-4 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
                    href={reference.url}
                  >
                    {reference.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <LessonNavigation previous={previous} next={next} />
      </article>
    </>
  );
}
