import { Link, useLocation } from "react-router-dom";

import { PageMetadata } from "@/components/seo/PageMetadata";

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <>
      <PageMetadata
        title="Page not found"
        description="The requested PhisGuard page could not be found. Return home or browse the learning centre."
        path={pathname}
      />
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Page not found
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
          The route you requested does not exist. You can return home or browse
          the learning curriculum.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-300"
          >
            Return home
          </Link>
          <Link
            to="/learn"
            className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300"
          >
            Browse lessons
          </Link>
        </div>
      </section>
    </>
  );
}
