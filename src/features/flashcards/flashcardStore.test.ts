import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { flashcards } from "./flashcardData";
import { FLASHCARDS_STORAGE_KEY } from "./flashcardStorage";

const firstCard = flashcards[0];
const secondCard = flashcards[1];

function failWritesTo(key: string) {
  const original = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
    this: Storage,
    storageKey: string,
    value: string,
  ) {
    if (storageKey === key) {
      throw new DOMException("Storage is full", "QuotaExceededError");
    }
    return original.call(this, storageKey, value);
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("flashcard store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it("marks a card known and persists it", async () => {
    const store = await import("./flashcardStore");
    store.markCardStatus(firstCard.id, "known", "2024-05-01T00:00:00.000Z");

    expect(store.getCardStatus(firstCard.id)).toBe("known");
    expect(
      JSON.parse(window.localStorage.getItem(FLASHCARDS_STORAGE_KEY)!),
    ).toEqual({
      version: 1,
      cards: {
        [firstCard.id]: {
          status: "known",
          updatedAt: "2024-05-01T00:00:00.000Z",
        },
      },
    });
  });

  it("moves a card between known and revision", async () => {
    const store = await import("./flashcardStore");
    store.markCardStatus(firstCard.id, "known");
    store.markCardStatus(firstCard.id, "revision");
    expect(store.getCardStatus(firstCard.id)).toBe("revision");
  });

  it("resets a single card", async () => {
    const store = await import("./flashcardStore");
    store.markCardStatus(firstCard.id, "known");
    store.resetCard(firstCard.id);
    expect(store.getCardStatus(firstCard.id)).toBe("unseen");
    expect(store.getFlashcardSnapshot().statuses).toEqual({});
  });

  it("resets only the requested deck", async () => {
    const store = await import("./flashcardStore");
    store.markCardStatus(firstCard.id, "known");
    store.markCardStatus(secondCard.id, "revision");

    store.resetDeck(firstCard.deckId);
    expect(store.getCardStatus(firstCard.id)).toBe("unseen");
    expect(store.getCardStatus(secondCard.id)).toBe("revision");
  });

  it("resets all progress", async () => {
    const store = await import("./flashcardStore");
    store.markCardStatus(firstCard.id, "known");
    store.resetAllFlashcardProgress();
    expect(store.getFlashcardSnapshot().statuses).toEqual({});
    expect(
      JSON.parse(window.localStorage.getItem(FLASHCARDS_STORAGE_KEY)!),
    ).toEqual({ version: 1, cards: {} });
  });

  it("rejects unknown cards and decks", async () => {
    const store = await import("./flashcardStore");
    expect(() => store.markCardStatus("not-a-card", "known")).toThrow(
      /unknown flashcard/,
    );
    expect(() => store.resetDeck("not-a-deck")).toThrow(
      /unknown flashcard deck/,
    );
  });

  it("notifies subscribers when state changes", async () => {
    const store = await import("./flashcardStore");
    const listener = vi.fn();
    const unsubscribe = store.subscribeToFlashcards(listener);

    store.markCardStatus(firstCard.id, "known");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.markCardStatus(secondCard.id, "known");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("flashcard store resilience", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it("keeps a failed save in memory and reports a notice", async () => {
    const store = await import("./flashcardStore");
    failWritesTo(FLASHCARDS_STORAGE_KEY);

    store.markCardStatus(firstCard.id, "known");

    expect(store.getCardStatus(firstCard.id)).toBe("known");
    expect(store.getFlashcardSnapshot().storageNotice).toMatch(
      /could not save/,
    );
    expect(window.localStorage.getItem(FLASHCARDS_STORAGE_KEY)).toBeNull();

    // A later read must not treat the unpersisted change as a successful save.
    expect(store.getFlashcardSnapshot().storageNotice).toMatch(
      /could not save/,
    );
  });

  it("replaces unreadable stored data only when the learner saves a change", async () => {
    const corrupt = "{not json";
    window.localStorage.setItem(FLASHCARDS_STORAGE_KEY, corrupt);
    const store = await import("./flashcardStore");

    expect(store.getFlashcardSnapshot().statuses).toEqual({});
    expect(store.getFlashcardSnapshot().storageNotice).toMatch(
      /could not be read/,
    );

    store.markCardStatus(firstCard.id, "known");
    // The unreadable value was replaced only because the learner saved a new
    // change; the notice clears once a valid value is written.
    expect(
      JSON.parse(window.localStorage.getItem(FLASHCARDS_STORAGE_KEY)!),
    ).toEqual({
      version: 1,
      cards: {
        [firstCard.id]: expect.objectContaining({ status: "known" }),
      },
    });
  });

  it("syncs progress written by another tab through the storage event", async () => {
    const store = await import("./flashcardStore");
    store.getFlashcardSnapshot();

    const value = JSON.stringify({
      version: 1,
      cards: {
        [firstCard.id]: {
          status: "known",
          updatedAt: "2024-05-01T00:00:00.000Z",
        },
      },
    });
    window.localStorage.setItem(FLASHCARDS_STORAGE_KEY, value);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: FLASHCARDS_STORAGE_KEY,
        newValue: value,
      }),
    );

    expect(store.getCardStatus(firstCard.id)).toBe("known");
  });

  it("does not let a stale second tab erase saved progress", async () => {
    vi.resetModules();
    const firstTab = await import("./flashcardStore");
    vi.resetModules();
    const secondTab = await import("./flashcardStore");

    secondTab.getFlashcardSnapshot();
    firstTab.markCardStatus(firstCard.id, "known");
    secondTab.markCardStatus(secondCard.id, "revision");

    expect(
      JSON.parse(window.localStorage.getItem(FLASHCARDS_STORAGE_KEY)!),
    ).toEqual({
      version: 1,
      cards: {
        [firstCard.id]: expect.objectContaining({ status: "known" }),
        [secondCard.id]: expect.objectContaining({ status: "revision" }),
      },
    });
  });
});
