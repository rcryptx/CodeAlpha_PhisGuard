import { Link, useParams } from "react-router-dom";

import { Breadcrumbs } from "@/components/learning/Breadcrumbs";
import { PageMetadata } from "@/components/seo/PageMetadata";
import { getGlossaryTerm } from "@/features/glossary/glossaryData";
import { GlossaryTermView } from "@/features/glossary/GlossaryTermView";

export function GlossaryTermPage() {
  const { termId = "" } = useParams();
  const term = getGlossaryTerm(termId);

  if (!term) {
    return (
      <>
        <PageMetadata
          title="Term not found"
          description="The requested glossary term could not be found."
          path={`/glossary/${termId}`}
        />
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[{ label: "Glossary", to: "/glossary" }, { label: "Not found" }]}
          />
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
            Term not found
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            We could not find a glossary term for “{termId}”. It may have been
            renamed or removed.
          </p>
          <p className="mt-6">
            <Link
              to="/glossary"
              className="text-base text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-200 dark:decoration-slate-600 dark:hover:decoration-slate-300"
            >
              Back to the glossary
            </Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMetadata
        title={`${term.term} · Glossary`}
        description={term.definition}
        path={`/glossary/${term.id}`}
      />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[{ label: "Glossary", to: "/glossary" }, { label: term.term }]}
        />
        <GlossaryTermView term={term} />
      </div>
    </>
  );
}
