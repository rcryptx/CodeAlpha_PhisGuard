import { Button } from '@/components/ui/Button';

export function AssessmentsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Assessments</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Measure understanding with confidence</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Future assessments will rely on deterministic scoring, answer explanations, retry logic, and duplicate-submission safeguards to support accurate evaluation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Foundations', '12 questions', 'Impersonation and digital trust signals.'],
          ['Links & domains', '10 questions', 'Moderate domain trust and safe verification habits.'],
          ['Decision making', '8 questions', 'Prioritize evidence over urgency.'],
        ].map(([title, meta, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{meta}</div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm text-slate-600">{description}</p>
          </article>
        ))}
      </div>

      <div>
        <Button variant="primary">Start assessment</Button>
      </div>
    </section>
  );
}
