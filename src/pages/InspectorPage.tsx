import { PageMetadata } from "@/components/seo/PageMetadata";
import { InspectorForm } from "@/features/url-inspector/InspectorForm";

export function InspectorPage() {
  return (
    <>
      <PageMetadata
        title="URL Inspector"
        description="Analyze URL structure locally with explainable indicators. PhisGuard never visits submitted URLs or checks live reputation."
        path="/inspector"
      />
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 border-b border-slate-200 pb-7 dark:border-slate-700">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            PhisGuard tool
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
            URL Inspector
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Review a link’s structure for indicators that may deserve a closer
            look. This is a local heuristic analysis—not a malware scan or a
            check of the website’s live reputation.
          </p>
        </header>
        <InspectorForm />
      </div>
    </>
  );
}
