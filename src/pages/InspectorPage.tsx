import { Button } from '@/components/ui/Button';

export function InspectorPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">URL inspection</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Analyze suspicious links safely</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          The inspector will explain local heuristics, highlight suspicious features, and avoid making unsupported claims about maliciousness without stronger evidence.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <label htmlFor="url" className="block text-sm font-medium text-slate-700">
            URL to inspect
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="url"
              type="url"
              placeholder="https://example.com/login"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            />
            <Button type="button">Inspect</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <h2 className="text-lg font-semibold text-slate-900">Safety principles</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Prefer explainable, local-only checks.</li>
            <li>• Never visit or execute a submitted URL automatically.</li>
            <li>• Distinguish suspicious indicators from confirmed malicious activity.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
