import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

import { flashcardDecks, flashcards, getCardsByCategory } from "./flashcardData";
import { FLASHCARDS_STORAGE_KEY } from "./flashcardStorage";

const firstDeck = flashcardDecks[0];

function resetFlashcardStorage() {
  window.localStorage.removeItem(FLASHCARDS_STORAGE_KEY);
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: FLASHCARDS_STORAGE_KEY,
      newValue: null,
      storageArea: window.localStorage,
    }),
  );
}

function renderFlashcards() {
  return render(
    <MemoryRouter initialEntries={["/flashcards"]}>
      <App />
    </MemoryRouter>,
  );
}

function studyDeckButton(deckTitle: string) {
  const deckLink = screen.getByRole("link", { name: deckTitle });
  const listItem = deckLink.closest("li");
  if (!listItem) throw new Error(`No list item found for deck ${deckTitle}`);
  return within(listItem).getByRole("button", { name: /deck/ });
}

beforeEach(() => {
  resetFlashcardStorage();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("flashcards page", () => {
  it("lists a deck for every lesson", async () => {
    renderFlashcards();
    expect(
      await screen.findByRole("heading", { level: 1, name: "Flashcards" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /^All/ })).toBeInTheDocument();
    for (const deck of flashcardDecks) {
      expect(screen.getByRole("link", { name: deck.title })).toHaveAttribute(
        "href",
        `/learn/${deck.lessonSlug}`,
      );
    }
    expect(screen.getByText(`${flashcardDecks.length} decks`, { exact: false }))
      .toBeInTheDocument();
  });

  it("filters decks by category and studies a whole category", async () => {
    renderFlashcards();
    await screen.findByRole("heading", { level: 1, name: "Flashcards" });

    fireEvent.click(screen.getByRole("button", { name: /^Recognize/ }));
    expect(
      screen.getByRole("link", { name: "Email phishing" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Password and account security" }),
    ).not.toBeInTheDocument();

    const recognizeCount = getCardsByCategory("Recognize").length;
    fireEvent.click(
      screen.getByRole("button", { name: "Study all Recognize cards" }),
    );
    expect(
      await screen.findByText(`Card 1 of ${recognizeCount}`),
    ).toBeInTheDocument();
  });

  it("reveals an answer and marks a card known, persisting it locally", async () => {
    renderFlashcards();
    await screen.findByRole("heading", { level: 1, name: "Flashcards" });

    const deckCards = flashcards.filter(
      (card) => card.deckId === firstDeck.id,
    );
    fireEvent.click(studyDeckButton(firstDeck.title));

    expect(
      await screen.findByText(`Card 1 of ${deckCards.length}`),
    ).toBeInTheDocument();
    expect(screen.getByText(deckCards[0].question)).toBeInTheDocument();
    expect(screen.queryByText(deckCards[0].answer)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show answer" }));
    expect(screen.getByText(deckCards[0].answer)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mark as known" }));
    expect(
      screen.getByText(`Card 2 of ${deckCards.length}`),
    ).toBeInTheDocument();

    const saved = JSON.parse(
      window.localStorage.getItem(FLASHCARDS_STORAGE_KEY) ?? "null",
    ) as { version: number; cards: Record<string, { status: string }> };
    expect(saved.version).toBe(1);
    expect(saved.cards[deckCards[0].id].status).toBe("known");
  });

  it("moves between cards with the buttons and the arrow keys", async () => {
    renderFlashcards();
    await screen.findByRole("heading", { level: 1, name: "Flashcards" });

    const deckCards = flashcards.filter((card) => card.deckId === firstDeck.id);
    fireEvent.click(studyDeckButton(firstDeck.title));
    await screen.findByText(`Card 1 of ${deckCards.length}`);

    const previous = screen.getByRole("button", { name: "Previous" });
    expect(previous).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(`Card 2 of ${deckCards.length}`)).toBeInTheDocument();
    expect(previous).toBeEnabled();

    const flashcardGroup = screen.getByRole("group", { name: "Flashcard" });
    fireEvent.keyDown(flashcardGroup, { key: "ArrowLeft" });
    expect(screen.getByText(`Card 1 of ${deckCards.length}`)).toBeInTheDocument();
    fireEvent.keyDown(flashcardGroup, { key: "ArrowRight" });
    expect(screen.getByText(`Card 2 of ${deckCards.length}`)).toBeInTheDocument();
  });

  it("supports review again and restarting a completed session", async () => {
    renderFlashcards();
    await screen.findByRole("heading", { level: 1, name: "Flashcards" });

    const deckCards = flashcards.filter((card) => card.deckId === firstDeck.id);
    fireEvent.click(studyDeckButton(firstDeck.title));
    await screen.findByText(`Card 1 of ${deckCards.length}`);

    // Review again keeps the card in the session: the deck length is unchanged.
    fireEvent.click(screen.getByRole("button", { name: "Review again" }));
    expect(screen.getByText(`Card 1 of ${deckCards.length}`)).toBeInTheDocument();

    for (let step = 0; step < deckCards.length; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Mark as known" }));
    }
    expect(
      await screen.findByRole("heading", {
        name: `You reviewed all ${deckCards.length} cards in ${firstDeck.title}.`,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Study again" }));
    expect(
      screen.getByText(`Card 1 of ${deckCards.length}`),
    ).toBeInTheDocument();
  });

  it("shows a notice when saved data cannot be read", async () => {
    window.localStorage.setItem(FLASHCARDS_STORAGE_KEY, "{not json");
    renderFlashcards();
    await screen.findByRole("heading", { level: 1, name: "Flashcards" });

    expect(await screen.findByRole("status")).toHaveTextContent(
      /could not be read/,
    );
  });

  it("warns and keeps changes in memory when storage writes fail", async () => {
    renderFlashcards();
    await screen.findByRole("heading", { level: 1, name: "Flashcards" });

    const deckCards = flashcards.filter((card) => card.deckId === firstDeck.id);
    fireEvent.click(studyDeckButton(firstDeck.title));
    await screen.findByText(`Card 1 of ${deckCards.length}`);

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is full", "QuotaExceededError");
    });

    fireEvent.click(screen.getByRole("button", { name: "Mark as known" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      /could not save/,
    );
    expect(
      screen.getByText(`Card 2 of ${deckCards.length}`),
    ).toBeInTheDocument();
  });
});
