export function ProgressPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Progress</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Your learning journey</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Progress tracking remains intentionally local-first, user-controlled, and grounded in actual activity rather than fabricated metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Scenarios completed', '0'],
          ['Average review score', '—'],
          ['Deck mastery', '0%'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
