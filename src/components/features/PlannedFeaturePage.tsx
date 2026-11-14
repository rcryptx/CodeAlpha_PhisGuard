import { Link } from "react-router-dom";

import { PageMetadata } from "@/components/seo/PageMetadata";

type PlannedFeaturePageProps = {
  title: string;
  description: string;
  path: string;
};

export function PlannedFeaturePage({
  title,
  description,
  path,
}: PlannedFeaturePageProps) {
  return (
    <>
      <PageMetadata title={title} description={description} path={path} />
      <section className="mx-auto max-w-3xl py-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          PhisGuard feature
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          {description}
        </p>
        <div className="mt-8 border-l-2 border-slate-300 pl-4 dark:border-slate-700">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            This feature is still in development.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Its route is part of the application foundation, but the interactive
            feature is not available yet. The learning centre is ready to use in
            the meantime.
          </p>
        </div>
        <Link
          to="/learn"
          className="mt-7 inline-flex items-center rounded-full border border-slate-800 bg-slate-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300"
        >
          Explore the learning centre{" "}
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </Link>
      </section>
    </>
  );
}
