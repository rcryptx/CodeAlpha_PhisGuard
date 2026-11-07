import { Button } from '@/components/ui/Button';

export function ZynxPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">ZYNX</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Your personal AI companion</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          ZYNX is architected for privacy-first guidance, multi-step learning support, and explicit consent before any stored memory or consequential action.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <h2 className="text-lg font-semibold text-slate-900">Guardrails</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Gemini API calls stay server-side.</li>
            <li>• No API keys in browser storage or frontend code.</li>
            <li>• User-led personalization and editable settings.</li>
            <li>• Explicit before-action confirmation for consequential tasks.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <h2 className="text-lg font-semibold text-slate-900">Future use cases</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Explain security concepts in context.</li>
            <li>• Coach through practice exercises and assessments.</li>
            <li>• Recommend learning paths based on user activity.</li>
            <li>• Support safer exploration and verification decisions.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <Button variant="primary">Begin onboarding</Button>
      </div>
    </section>
  );
}
