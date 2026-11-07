export function ResourcesPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Resources</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Reliable learning references</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Future educational resources will prioritize maintainable, factual, and clearly sourced material rather than fabricated social proof or placeholder claims.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Cybersecurity base', 'General principles, threat models, and safer digital habits.'],
          ['Phishing patterns', 'Common social engineering techniques and high-risk triggering cues.'],
          ['Verification checklist', 'A quick checklist for when to pause, inspect, and confirm before acting.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
