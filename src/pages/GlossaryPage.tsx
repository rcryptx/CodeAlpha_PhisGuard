import { PageMetadata } from "@/components/seo/PageMetadata";
import { GlossaryDirectory } from "@/features/glossary/GlossaryDirectory";

export function GlossaryPage() {
  return (
    <>
      <PageMetadata
        title="Cybersecurity glossary"
        description="A searchable glossary of cybersecurity terms with plain-language explanations, examples, and links to related PhisGuard lessons."
        path="/glossary"
      />
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 border-b border-slate-200 pb-7 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            PhisGuard library
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
            Cybersecurity glossary
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Browse plain-language definitions for the terms used across
            PhisGuard and the wider security field. Search, filter by category
            or difficulty, and bookmark terms you want to revisit. Everything is
            stored locally in your browser.
          </p>
        </header>
        <GlossaryDirectory />
      </div>
    </>
  );
}
