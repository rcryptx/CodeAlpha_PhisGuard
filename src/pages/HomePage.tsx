import { Link } from 'react-router-dom';

import { appName, appTagline, featureHighlights } from '@/config/site';

const primaryLinkClasses =
  'inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition duration-200 ease-out hover:bg-slate-700';
const secondaryLinkClasses =
  'inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition duration-200 ease-out hover:border-slate-300 hover:bg-slate-100';

export function HomePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60 sm:p-10">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-600">
          Security awareness platform
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
          {appName}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">{appTagline}</p>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
          Build habits that help users pause, inspect, and verify before engaging with links, emails, and digital requests.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/learn" className={primaryLinkClasses}>
            Explore learning
          </Link>
          <Link to="/inspector" className={secondaryLinkClasses}>
            Inspect a URL
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureHighlights.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
