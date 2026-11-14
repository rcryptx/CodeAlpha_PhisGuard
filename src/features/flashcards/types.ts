import type { Lesson } from "@/features/learning/curriculum";

/**
 * A learner-controlled study state for a single card.
 *
 * `unseen` is never persisted: a card is treated as unseen when it has no
 * saved record. `known` and `revision` are the two explicit choices a learner
 * can make while studying.
 */
export type StudyStatus = "unseen" | "known" | "revision";

export type CardDifficulty = "intro" | "medium" | "advanced";

/** A single question/answer card, derived from a Learning Centre lesson. */
export interface Flashcard {
  id: string;
  /** The deck this card belongs to. Decks map one-to-one to lessons. */
  deckId: string;
  /** The prompt shown on the front of the card. */
  question: string;
  /** The answer revealed on the back of the card. */
  answer: string;
  /** Searchable keywords that summarise the card's focus. */
  keywords: string[];
  difficulty: CardDifficulty;
  /** The Learning Centre lesson this card is drawn from. */
  lessonSlug: string;
}

/** A deck of cards. The catalogue builds exactly one deck per lesson. */
export interface FlashcardDeck {
  id: string;
  title: string;
  /** The lesson category ("Recognize", "Understand", "Protect", "Respond"). */
  category: Lesson["category"];
  description: string;
  /** The Learning Centre lesson this deck is drawn from. */
  lessonSlug: string;
  cardIds: string[];
}
