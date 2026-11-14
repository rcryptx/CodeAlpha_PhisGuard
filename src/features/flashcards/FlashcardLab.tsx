import { useState } from "react";

import { useFlashcards } from "./useFlashcards";
import { DeckDirectory, type CategoryFilter } from "./DeckDirectory";
import { StudySession } from "./StudySession";
import type { Flashcard } from "./types";

interface StudyTarget {
  title: string;
  cards: Flashcard[];
}

export function FlashcardLab() {
  const {
    statuses,
    storageNotice,
    markCardStatus,
    resetCard,
    resetDeck,
    resetAllFlashcardProgress,
  } = useFlashcards();
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [session, setSession] = useState<StudyTarget | null>(null);

  const savedCount = Object.keys(statuses).length;

  return (
    <div>
      {storageNotice && (
        <p
          className="mb-5 rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          role="status"
        >
          {storageNotice}
        </p>
      )}

      {session ? (
        <StudySession
          title={session.title}
          cards={session.cards}
          statuses={statuses}
          onMark={markCardStatus}
          onResetCard={resetCard}
          onExit={() => setSession(null)}
        />
      ) : (
        <>
          <DeckDirectory
            statuses={statuses}
            category={category}
            onSelectCategory={setCategory}
            onStudyDeck={(deck, cards) =>
              setSession({ title: deck.title, cards })
            }
            onStudyCards={(cards, title) => setSession({ title, cards })}
            onResetDeck={resetDeck}
          />

          <section
            aria-labelledby="flashcard-data-heading"
            className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800"
          >
            <h2
              id="flashcard-data-heading"
              className="text-sm font-semibold text-slate-900 dark:text-white"
            >
              Your flashcard data
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Card statuses are stored only in this browser under the key
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                phisguard.flashcard-progress
              </code>
              . They are never sent to a server. Clearing your browser data
              removes them.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {savedCount === 0
                ? "No card statuses are saved yet."
                : `${savedCount} card ${savedCount === 1 ? "status is" : "statuses are"} saved on this device.`}
            </p>
            {savedCount > 0 && (
              <button
                type="button"
                onClick={() => resetAllFlashcardProgress()}
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-300"
              >
                Reset all flashcard progress
              </button>
            )}
          </section>
        </>
      )}
    </div>
  );
}
