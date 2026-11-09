import { PageMetadata } from "@/components/seo/PageMetadata";
import { ResourcesDirectory } from "@/features/resources/ResourcesDirectory";

export function ResourcesPage() {
  return (
    <>
      <PageMetadata
        title="Learning resources"
        description="A curated directory of official cybersecurity guidance and relevant PhisGuard lessons."
        path="/resources"
      />
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 border-b border-slate-200 pb-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            PhisGuard library
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Learning resources
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Find practical guidance from established cybersecurity
            organizations, alongside related lessons hosted in PhisGuard.
            External materials open on their source websites.
          </p>
        </header>
        <ResourcesDirectory />
      </div>
    </>
  );
}
