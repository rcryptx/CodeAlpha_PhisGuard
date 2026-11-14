import { describe, expect, it } from "vitest";

import { flashcards } from "./flashcardData";

import {
  FLASHCARDS_SCHEMA_VERSION,
  parseFlashcardProgress,
  serializeFlashcardProgress,
  toCardStatusMap,
} from "./flashcardStorage";

const knownCardId = flashcards[0].id;
const otherCardId = flashcards[1].id;

describe("parseFlashcardProgress", () => {
  it("returns empty trusted progress for a missing value", () => {
    const parsed = parseFlashcardProgress(null);
    expect(parsed.data.cards).toEqual({});
    expect(parsed.storageNotice).toBeNull();
    expect(parsed.trusted).toBe(true);
  });

  it("parses valid saved records", () => {
    const raw = JSON.stringify({
      version: FLASHCARDS_SCHEMA_VERSION,
      cards: {
        [knownCardId]: {
          status: "known",
          updatedAt: "2024-05-01T00:00:00.000Z",
        },
      },
    });
    const parsed = parseFlashcardProgress(raw);
    expect(parsed.trusted).toBe(true);
    expect(parsed.storageNotice).toBeNull();
    expect(parsed.data.cards[knownCardId]).toEqual({
      status: "known",
      updatedAt: "2024-05-01T00:00:00.000Z",
    });
  });

  it("reports unreadable data as untrusted without discarding it", () => {
    const parsed = parseFlashcardProgress("{not json");
    expect(parsed.data.cards).toEqual({});
    expect(parsed.storageNotice).toMatch(/could not be read/);
    expect(parsed.trusted).toBe(false);
  });

  it("reports an unsupported version as untrusted", () => {
    const parsed = parseFlashcardProgress(
      JSON.stringify({ version: 99, cards: {} }),
    );
    expect(parsed.storageNotice).toMatch(/unsupported format/);
    expect(parsed.trusted).toBe(false);
  });

  it("reports a non-object cards field as unsupported", () => {
    const parsed = parseFlashcardProgress(
      JSON.stringify({ version: FLASHCARDS_SCHEMA_VERSION, cards: ["a"] }),
    );
    expect(parsed.storageNotice).toMatch(/unsupported format/);
    expect(parsed.trusted).toBe(false);
  });

  it("drops unknown card ids and reports how many were ignored", () => {
    const parsed = parseFlashcardProgress(
      JSON.stringify({
        version: FLASHCARDS_SCHEMA_VERSION,
        cards: {
          [knownCardId]: {
            status: "known",
            updatedAt: "2024-05-01T00:00:00.000Z",
          },
          "not-a-card": {
            status: "known",
            updatedAt: "2024-05-01T00:00:00.000Z",
          },
        },
      }),
    );
    expect(Object.keys(parsed.data.cards)).toEqual([knownCardId]);
    expect(parsed.storageNotice).toMatch(/1 invalid saved flashcard entry/);
  });

  it("drops records with invalid statuses or timestamps", () => {
    const parsed = parseFlashcardProgress(
      JSON.stringify({
        version: FLASHCARDS_SCHEMA_VERSION,
        cards: {
          [knownCardId]: { status: "unseen", updatedAt: "2024-05-01T00:00:00Z" },
          [otherCardId]: { status: "known", updatedAt: "not-a-date" },
        },
      }),
    );
    expect(parsed.data.cards).toEqual({});
    expect(parsed.storageNotice).toMatch(/2 invalid saved flashcard entries/);
  });
});

describe("serializeFlashcardProgress", () => {
  it("round-trips through parse", () => {
    const cards = {
      [knownCardId]: {
        status: "revision" as const,
        updatedAt: "2024-06-02T10:00:00.000Z",
      },
    };
    const parsed = parseFlashcardProgress(serializeFlashcardProgress(cards));
    expect(parsed.data.cards).toEqual(cards);
  });

  it("writes the schema version", () => {
    expect(JSON.parse(serializeFlashcardProgress({}))).toEqual({
      version: FLASHCARDS_SCHEMA_VERSION,
      cards: {},
    });
  });
});

describe("toCardStatusMap", () => {
  it("normalizes records into an id to status map", () => {
    const map = toCardStatusMap({
      version: FLASHCARDS_SCHEMA_VERSION,
      cards: {
        [knownCardId]: { status: "known", updatedAt: "2024-05-01T00:00:00Z" },
        [otherCardId]: {
          status: "revision",
          updatedAt: "2024-05-01T00:00:00Z",
        },
      },
    });
    expect(map).toEqual({ [knownCardId]: "known", [otherCardId]: "revision" });
  });
});
