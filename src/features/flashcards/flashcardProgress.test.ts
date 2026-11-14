import { describe, expect, it } from "vitest";

import { getDeckProgress, shuffleIds } from "./flashcardProgress";

describe("getDeckProgress", () => {
  it("counts known, revision, and unseen cards", () => {
    const progress = getDeckProgress(["a", "b", "c", "d"], {
      a: "known",
      b: "known",
      c: "revision",
    });
    expect(progress).toEqual({
      total: 4,
      known: 2,
      revision: 1,
      unseen: 1,
      masteryPercentage: 50,
    });
  });

  it("treats missing statuses as unseen", () => {
    const progress = getDeckProgress(["a", "b"], {});
    expect(progress.known).toBe(0);
    expect(progress.revision).toBe(0);
    expect(progress.unseen).toBe(2);
    expect(progress.masteryPercentage).toBe(0);
  });

  it("ignores statuses for cards outside the deck", () => {
    const progress = getDeckProgress(["a"], { a: "known", z: "known" });
    expect(progress.known).toBe(1);
    expect(progress.total).toBe(1);
    expect(progress.masteryPercentage).toBe(100);
  });

  it("handles an empty deck without dividing by zero", () => {
    expect(getDeckProgress([], {})).toEqual({
      total: 0,
      known: 0,
      revision: 0,
      unseen: 0,
      masteryPercentage: 0,
    });
  });
});

describe("shuffleIds", () => {
  it("returns a permutation of the input", () => {
    const input = ["a", "b", "c", "d", "e"];
    const result = shuffleIds(input, () => 0.5);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it("does not mutate the input array", () => {
    const input = ["a", "b", "c"];
    const copy = [...input];
    shuffleIds(input, () => 0.25);
    expect(input).toEqual(copy);
  });

  it("is deterministic for a fixed random source", () => {
    const sequence = [0.1, 0.9, 0.3, 0.7];
    let index = 0;
    const random = () => sequence[index++ % sequence.length];
    const first = shuffleIds(["a", "b", "c", "d"], random);
    index = 0;
    const second = shuffleIds(["a", "b", "c", "d"], random);
    expect(first).toEqual(second);
  });
});
