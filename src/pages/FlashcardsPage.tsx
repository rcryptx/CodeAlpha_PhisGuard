import { PageMetadata } from "@/components/seo/PageMetadata";
import { FlashcardLab } from "@/features/flashcards/FlashcardLab";

export function FlashcardsPage() {
  return (
    <>
      <PageMetadata
        title="Flashcards"
        description="Study question-and-answer flashcards built from the PhisGuard lessons. Mark cards as known or needing revision, shuffle decks, and track progress locally in your browser."
        path="/flashcards"
      />
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 border-b border-slate-200 pb-7 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            PhisGuard practice
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
            Flashcards
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Test your recall with question-and-answer cards drawn from the
            twelve Learning Centre lessons. Reveal each answer, mark cards you
            know or want to revise, and revisit a deck any time. Everything is
            stored locally in your browser, and no answer is sent anywhere.
          </p>
        </header>
        <FlashcardLab />
      </div>
    </>
  );
}
