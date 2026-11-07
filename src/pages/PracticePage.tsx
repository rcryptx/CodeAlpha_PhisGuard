import { Button } from '@/components/ui/Button';

export function PracticePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Practice lab</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">The decision exercise</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Simulated phishing scenarios help users practice instinctive checks, understand context, and learn why certain actions are risky.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Phishing email', 'A message claims a password reset is required and creates urgency.', 'Decision: verify via the official app instead of the link in the message.'],
          ['Fake invoice', 'An invoice uses a lookalike domain and unusual payment request language.', 'Decision: confirm with the vendor through a known contact method.'],
        ].map(([title, prompt, takeaway]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm text-slate-600">{prompt}</p>
            <p className="mt-3 text-sm font-medium text-slate-800">{takeaway}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Start scenario</Button>
          <Button variant="secondary">Review explanations</Button>
        </div>
      </div>
    </section>
  );
}
