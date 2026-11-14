import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Shuffle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { getFlashcard, getLessonTitleForCard } from "./flashcardData";
import {
  getDeckProgress,
  shuffleIds,
  type CardStatusMap,
} from "./flashcardProgress";
import type { Flashcard, StudyStatus } from "./types";

const navButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-300";

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-300";

const statusBadge: Record<StudyStatus, string> = {
  unseen: "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300",
  known:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  revision:
    "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100",
};

const statusLabel: Record<StudyStatus, string> = {
  unseen: "Not studied yet",
  known: "Marked as known",
  revision: "Needs revision",
};

interface StudySessionProps {
  title: string;
  cards: Flashcard[];
  statuses: CardStatusMap;
  onMark: (cardId: string, status: "known" | "revision") => void;
  onResetCard: (cardId: string) => void;
  onExit: () => void;
}

export function StudySession({
  title,
  cards,
  statuses,
  onMark,
  onResetCard,
  onExit,
}: StudySessionProps) {
  const [order, setOrder] = useState<string[]>(() =>
    cards.map((card) => card.id),
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ known: 0, revision: 0 });

  useEffect(() => {
    setFlipped(false);
  }, [index]);

  if (cards.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 p-7 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          No cards in this deck
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This selection has no cards to study. Return to the deck list and pick
          another topic.
        </p>
        <button type="button" onClick={onExit} className={cn(primaryButtonClass, "mt-5")}>
          Back to decks
        </button>
      </section>
    );
  }

  const total = order.length;
  const completed = Math.min(index, total);
  const currentCard = getFlashcard(order[index]);
  const deckProgress = getDeckProgress(
    cards.map((card) => card.id),
    statuses,
  );

  const sessionComplete = index >= total;

  const advance = () => setIndex((value) => Math.min(value + 1, total));

  const handleMark = (status: "known" | "revision") => {
    if (!currentCard) return;
    onMark(currentCard.id, status);
    setSessionStats((stats) => ({
      known: stats.known + (status === "known" ? 1 : 0),
      revision: stats.revision + (status === "revision" ? 1 : 0),
    }));
    advance();
  };

  const handleReviewAgain = () => {
    setOrder((previous) => {
      const next = [...previous];
      const [current] = next.splice(index, 1);
      next.push(current);
      return next;
    });
    setFlipped(false);
  };

  const handleShuffle = () => {
    setOrder((previous) => shuffleIds(previous));
    setIndex(0);
    setFlipped(false);
    setSessionStats({ known: 0, revision: 0 });
  };

  const handleRestart = () => {
    setIndex(0);
    setFlipped(false);
    setSessionStats({ known: 0, revision: 0 });
  };

  if (sessionComplete) {
    return (
      <section aria-labelledby="session-complete-heading">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Session complete
          </p>
          <h2
            id="session-complete-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            You reviewed all {total} cards in {title}.
          </h2>
          <dl className="mt-5 grid max-w-xl grid-cols-3 gap-4">
            {[
              ["This session · known", sessionStats.known],
              ["This session · revise", sessionStats.revision],
              ["Deck known", `${deckProgress.known}/${deckProgress.total}`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-t border-slate-300 pt-2 dark:border-slate-700"
              >
                <dt className="text-xs text-slate-600 dark:text-slate-300">
                  {label}
                </dt>
                <dd className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Progress reflects cards you marked yourself. It is stored only in
            this browser and is not spaced repetition.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleRestart} className={primaryButtonClass}>
              <RotateCcw aria-hidden="true" size={16} strokeWidth={1.75} />
              Study again
            </button>
            <button type="button" onClick={onExit} className={navButtonClass}>
              Back to decks
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentStatus = currentCard
    ? (statuses[currentCard.id] ?? "unseen")
    : "unseen";
  const lessonTitle = currentCard
    ? getLessonTitleForCard(currentCard)
    : "Learning Centre lesson";

  return (
    <section aria-labelledby="study-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Studying
          </p>
          <h2
            id="study-heading"
            className="mt-1 text-lg font-semibold text-slate-950 dark:text-white"
          >
            {title}
          </h2>
        </div>
        <button type="button" onClick={onExit} className={navButtonClass}>
          Back to decks
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <span aria-live="polite">
            Card {completed + 1} of {total}
          </span>
          <span>
            Deck: {deckProgress.known} known / {deckProgress.total}
          </span>
        </div>
        <progress
          aria-label="Session progress"
          className="mt-2 h-2 w-full accent-slate-800 dark:accent-slate-200"
          max={total}
          value={completed}
        />
      </div>

      <div
        className="mt-6"
        role="group"
        aria-label="Flashcard"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            setIndex((value) => Math.max(0, value - 1));
          } else if (event.key === "ArrowRight" && index < total - 1) {
            event.preventDefault();
            setIndex((value) => Math.min(total - 1, value + 1));
          }
        }}
      >
        <button
          type="button"
          aria-pressed={flipped}
          onClick={() => setFlipped((value) => !value)}
          className="block w-full rounded-2xl border border-slate-300 bg-white p-6 text-left transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500 dark:focus-visible:outline-slate-300 sm:p-8"
        >
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {currentCard?.difficulty} · {currentCard?.keywords.join(", ")}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                statusBadge[currentStatus],
              )}
            >
              {statusLabel[currentStatus]}
            </span>
          </span>

          <span className="mt-4 block text-xl font-semibold leading-8 text-slate-950 dark:text-white sm:text-2xl sm:leading-9">
            {currentCard?.question}
          </span>

          {flipped ? (
            <span className="mt-5 block border-t border-slate-200 pt-5 dark:border-slate-700">
              <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Answer
              </span>
              <span className="mt-2 block text-base leading-7 text-slate-800 dark:text-slate-100">
                {currentCard?.answer}
              </span>
            </span>
          ) : (
            <span className="mt-5 block text-sm font-medium text-slate-500 dark:text-slate-400">
              Select the card to reveal the answer.
            </span>
          )}
        </button>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Related lesson:{" "}
          <Link
            to={`/learn/${currentCard?.lessonSlug}`}
            className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-200 dark:decoration-slate-600 dark:hover:decoration-slate-300"
          >
            {lessonTitle}
          </Link>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setFlipped((value) => !value)}
            className={navButtonClass}
          >
            {flipped ? (
              <EyeOff aria-hidden="true" size={16} strokeWidth={1.75} />
            ) : (
              <Eye aria-hidden="true" size={16} strokeWidth={1.75} />
            )}
            {flipped ? "Hide answer" : "Show answer"}
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            className={navButtonClass}
          >
            <Shuffle aria-hidden="true" size={16} strokeWidth={1.75} />
            Shuffle
          </button>
        </div>

        <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleMark("known")}
            className={primaryButtonClass}
          >
            <ThumbsUp aria-hidden="true" size={16} strokeWidth={1.75} />
            Mark as known
          </button>
          <button
            type="button"
            onClick={() => handleMark("revision")}
            className={cn(navButtonClass, "border-amber-400 dark:border-amber-600")}
          >
            <ThumbsDown aria-hidden="true" size={16} strokeWidth={1.75} />
            Needs revision
          </button>
          <button
            type="button"
            onClick={handleReviewAgain}
            className={navButtonClass}
          >
            <RotateCcw aria-hidden="true" size={16} strokeWidth={1.75} />
            Review again
          </button>
        </div>

        {currentStatus !== "unseen" && (
          <button
            type="button"
            onClick={() => currentCard && onResetCard(currentCard.id)}
            className="mt-4 rounded-sm text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-400 dark:hover:text-white"
          >
            Clear saved status for this card
          </button>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
            className={navButtonClass}
          >
            <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.75} />
            Previous
          </button>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}
            disabled={index >= total - 1}
            className={navButtonClass}
          >
            Next
            <ChevronRight aria-hidden="true" size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  );
}
