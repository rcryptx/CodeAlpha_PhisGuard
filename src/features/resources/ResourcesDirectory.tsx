import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  filterResources,
  getResourceLessonTitle,
  resourceCategories,
  resourceCatalog,
  validateResourceCatalog,
} from "./resourceData";
import type { LearningResource, ResourceCategory } from "./resourceData";

export function ResourcesDirectory({
  catalog = resourceCatalog,
}: {
  catalog?: unknown;
}) {
  const { resources, errors } = useMemo(
    () => validateResourceCatalog(catalog),
    [catalog],
  );
  const [category, setCategory] = useState<ResourceCategory | "All">("All");
  const [query, setQuery] = useState("");
  const visibleResources = filterResources(resources, category, query);

  return (
    <div>
      {errors.length > 0 && (
        <p
          className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
          role="status"
        >
          Some resource entries were omitted because their information was
          invalid.
        </p>
      )}

      <div className="grid gap-5 border-b border-slate-200 pb-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label
            htmlFor="resource-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search resources
          </label>
          <input
            id="resource-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, source, or topic"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        <p className="text-sm text-slate-600" aria-live="polite">
          {visibleResources.length}{" "}
          {visibleResources.length === 1 ? "resource" : "resources"}
        </p>
      </div>

      <div
        className="flex flex-wrap gap-2 py-5"
        role="group"
        aria-label="Filter resources by category"
      >
        {(["All", ...resourceCategories] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={category === option}
            onClick={() => setCategory(option)}
            className={`min-h-10 rounded-full border px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300 ${
              category === option
                ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {visibleResources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-7">
          <h2 className="text-lg font-semibold text-slate-900">
            {resources.length === 0
              ? "No resources are available"
              : "No matching resources"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {resources.length === 0
              ? "The catalogue could not provide any valid entries."
              : "Try another search term or select a different category."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {visibleResources.map((resource) => (
            <li key={resource.id}>
              <ResourceRow resource={resource} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResourceRow({ resource }: { resource: LearningResource }) {
  const internal = resource.kind === "PhisGuard lesson";
  return (
    <article className="py-5 sm:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {resource.category} · {resource.kind}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">
            {internal ? (
              <Link
                to={resource.url}
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {resource.title}
              </Link>
            ) : (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {resource.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{resource.source}</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {resource.description}
          </p>
          {resource.lessonSlugs.length > 0 && (
            <p className="mt-3 text-sm text-slate-600">
              Related lessons:{" "}
              {resource.lessonSlugs.map((slug, index) => {
                const title = getResourceLessonTitle(slug);
                return title ? (
                  <span key={slug}>
                    {index > 0 ? ", " : ""}
                    <Link
                      to={`/learn/${slug}`}
                      className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700"
                    >
                      {title}
                    </Link>
                  </span>
                ) : null;
              })}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs text-slate-500">
          {internal ? "On PhisGuard" : "External source"}
        </span>
      </div>
    </article>
  );
}
