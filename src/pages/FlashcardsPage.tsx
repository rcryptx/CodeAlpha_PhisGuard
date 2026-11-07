import { Button } from '@/components/ui/Button';

export function FlashcardsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Flashcards</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Review without overload</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          The future flashcard engine will support topic-wise decks, front/back review flow, review history, bookmarks, and spaced repetition while respecting local-first storage.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Social engineering', 'Recognize pressure tactics that encourage fast action without verification.'],
          ['Credential hygiene', 'Question unexpected login prompts and verify the destination before entering credentials.'],
          ['Domain scrutiny', 'Look for subtle mismatch patterns, impersonated brands, and shortened links.'],
          ['Safe habits', 'Build routines that reduce risk, such as pause-check-verify before acting.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Open deck</Button>
          <Button variant="secondary">Review schedule</Button>
        </div>
      </div>
    </section>
  );
}
