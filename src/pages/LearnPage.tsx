import { Button } from '@/components/ui/Button';

export function LearnPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Learning hub</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Learn the fundamentals</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Explore phishing patterns, deceptive design, and practical verification habits that strengthen day-to-day judgment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Impersonation', 'Recognize urgency, authority spoofing, and communication patterns that drive unsafe clicks.'],
          ['Credential traps', 'Understand fake login flows, cloned portals, and the signals that suggest a suspicious handoff.'],
          ['Verification habits', 'Use deliberate pause-and-check routines before entering credentials or sharing information.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Phase 1 foundation</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Content modules and learning flows are intentionally left as structured boundaries so later phases can add curriculum and assessment-driven learning without rebuilding the app shell.
        </p>
        <div className="mt-4">
          <Button variant="secondary">Start a guided module</Button>
        </div>
      </div>
    </section>
  );
}
