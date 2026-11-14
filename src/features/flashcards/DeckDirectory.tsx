import { Link } from "react-router-dom";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  flashcardCategoryOptions,
  flashcardDecks,
  getDeckCardsById,
} from "./flashcardData";
import { getDeckProgress, type CardStatusMap } from "./flashcardProgress";
import type { Flashcard, FlashcardDeck } from "./types";

const chipClass = (active: boolean) =>
  cn(
    "min-h-9 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300",
    active
      ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  );

const studyButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300";

export type CategoryFilter = "All" | (typeof flashcardCategoryOptions)[number];

interface DeckDirectoryProps {
  statuses: CardStatusMap;
  category: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  onStudyDeck: (deck: FlashcardDeck, cards: Flashcard[]) => void;
  onStudyCards: (cards: Flashcard[], title: string) => void;
  onResetDeck: (deckId: string) => void;
}

export function DeckDirectory({
  statuses,
  category,
  onSelectCategory,
  onStudyDeck,
  onStudyCards,
  onResetDeck,
}: DeckDirectoryProps) {
  const visibleDecks =
    category === "All"
      ? flashcardDecks
      : flashcardDecks.filter((deck) => deck.category === category);

  const categoryCardCount = flashcardDecks.reduce((total, deck) => {
    if (category !== "All" && deck.category !== category) return total;
    return total + deck.cardIds.length;
  }, 0);

  return (
    <div>
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Filter by category
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter flashcard decks by category"
        >
          {(["All", ...flashcardCategoryOptions] as const).map((option) => {
            const count =
              option === "All"
                ? flashcardDecks.length
                : flashcardDecks.filter((deck) => deck.category === option)
                    .length;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={category === option}
                onClick={() => onSelectCategory(option)}
                className={chipClass(category === option)}
              >
                {option}
                <span className="ml-1.5 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {visibleDecks.length}{" "}
            {visibleDecks.length === 1 ? "deck" : "decks"} ·{" "}
            {categoryCardCount}{" "}
            {categoryCardCount === 1 ? "card" : "cards"}
          </p>
          <button
            type="button"
            onClick={() => onStudyCards(categoryCards(visibleDecks), studyTitle(category))}
            className={studyButtonClass}
          >
            {category === "All"
              ? "Study all cards"
              : `Study all ${category} cards`}
          </button>
        </div>
      </div>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
        {visibleDecks.map((deck) => {
          const cards = getDeckCardsById(deck.cardIds);
          const progress = getDeckProgress(deck.cardIds, statuses);
          return (
            <li
              key={deck.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {deck.category} · {deck.cardIds.length} cards
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                <Link
                  to={`/learn/${deck.lessonSlug}`}
                  className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:decoration-slate-600 dark:hover:decoration-slate-300"
                >
                  {deck.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {deck.description}
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>
                    {progress.known} known · {progress.revision} to revise
                  </span>
                  <span>{progress.masteryPercentage}%</span>
                </div>
                <progress
                  aria-label={`${deck.title} mastery`}
                  className="mt-2 h-2 w-full accent-slate-800 dark:accent-slate-200"
                  max={progress.total}
                  value={progress.known}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onStudyDeck(deck, cards)}
                  className={studyButtonClass}
                >
                  {progress.known + progress.revision > 0
                    ? "Continue deck"
                    : "Study deck"}
                </button>
                {(progress.known > 0 || progress.revision > 0) && (
                  <button
                    type="button"
                    onClick={() => onResetDeck(deck.id)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-transparent px-3 text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:text-slate-300 dark:hover:text-white"
                  >
                    <RotateCcw aria-hidden="true" size={14} strokeWidth={1.75} />
                    Reset deck
                  </button>
                )}
              </div>

              {progress.known === progress.total && progress.total > 0 && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 aria-hidden="true" size={14} strokeWidth={1.75} />
                  All cards marked known
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function categoryCards(decks: FlashcardDeck[]): Flashcard[] {
  return decks.flatMap((deck) => getDeckCardsById(deck.cardIds));
}

function studyTitle(category: CategoryFilter): string {
  return category === "All"
    ? "All PhisGuard cards"
    : `${category} cards`;
}
