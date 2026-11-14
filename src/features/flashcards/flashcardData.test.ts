import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learning/curriculum";

import {
  flashcardCategoryOptions,
  flashcardDecks,
  flashcards,
  getCardCategory,
  getCardsByCategory,
  getDeckCards,
  getDeckCardsById,
  getFlashcard,
  getFlashcardDeck,
} from "./flashcardData";

describe("flashcard catalogue", () => {
  it("builds exactly one deck per lesson", () => {
    expect(flashcardDecks).toHaveLength(lessons.length);
    for (const lesson of lessons) {
      const deck = getFlashcardDeck(lesson.slug);
      expect(deck).toBeDefined();
      expect(deck?.title).toBe(lesson.title);
      expect(deck?.lessonSlug).toBe(lesson.slug);
      expect(deck?.category).toBe(lesson.category);
    }
  });

  it("has unique deck and card ids", () => {
    const deckIds = flashcardDecks.map((deck) => deck.id);
    expect(new Set(deckIds).size).toBe(deckIds.length);

    const cardIds = flashcards.map((card) => card.id);
    expect(new Set(cardIds).size).toBe(cardIds.length);
  });

  it("keeps every card reference resolvable in both directions", () => {
    for (const deck of flashcardDecks) {
      const cards = getDeckCardsById(deck.cardIds);
      expect(cards).toHaveLength(deck.cardIds.length);
      for (const card of cards) {
        expect(card.deckId).toBe(deck.id);
        expect(card.lessonSlug).toBe(deck.lessonSlug);
        expect(getFlashcard(card.id)).toBe(card);
      }
    }
    for (const card of flashcards) {
      expect(getFlashcardDeck(card.deckId)).toBeDefined();
    }
  });

  it("keeps deck.cardIds consistent with getDeckCards", () => {
    for (const deck of flashcardDecks) {
      expect(getDeckCards(deck.id).map((card) => card.id)).toEqual(
        deck.cardIds,
      );
    }
  });

  it("gives every card a question, answer, keyword, and difficulty", () => {
    for (const card of flashcards) {
      expect(card.question.trim().length).toBeGreaterThan(0);
      expect(card.answer.trim().length).toBeGreaterThan(0);
      expect(card.keywords.length).toBeGreaterThan(0);
      expect(["intro", "medium", "advanced"]).toContain(card.difficulty);
    }
  });

  it("gives every deck at least one card", () => {
    for (const deck of flashcardDecks) {
      expect(deck.cardIds.length).toBeGreaterThan(0);
    }
  });

  it("maps categories back to their decks and cards", () => {
    expect(flashcardCategoryOptions).toEqual([
      "Recognize",
      "Understand",
      "Protect",
      "Respond",
    ]);

    for (const category of flashcardCategoryOptions) {
      const decksInCategory = flashcardDecks.filter(
        (deck) => deck.category === category,
      );
      const expectedCardCount = decksInCategory.reduce(
        (total, deck) => total + deck.cardIds.length,
        0,
      );
      const cards = getCardsByCategory(category);
      expect(cards).toHaveLength(expectedCardCount);
      for (const card of cards) {
        expect(getCardCategory(card)).toBe(category);
      }
    }

    const totalByCategory = flashcardCategoryOptions.reduce(
      (total, category) => total + getCardsByCategory(category).length,
      0,
    );
    expect(totalByCategory).toBe(flashcards.length);
  });
});
