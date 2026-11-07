import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm shadow-slate-200/60">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Page not found</h1>
      <p className="mt-4 text-base text-slate-600">
        The route you requested does not exist yet, or the page is still being prepared in a future phase.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition duration-200 ease-out hover:bg-slate-700"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
