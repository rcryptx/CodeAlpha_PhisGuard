import { describe, expect, it } from "vitest";

import {
  countGlossaryTermsByCategory,
  filterGlossaryTerms,
  getGlossaryLessonTitle,
  getGlossaryTerm,
  getRecentGlossaryTerms,
  getRelatedGlossaryTerms,
  selectGlossaryTerms,
  sortGlossaryTerms,
  validateGlossaryCatalog,
} from "./glossaryData";
import { glossaryTerms } from "./terms";
import { glossaryCategories } from "./types";

const base = {
  definition: "A definition.",
  explanation: "An explanation.",
  example: "An example.",
  category: "Phishing" as const,
  difficulty: "Beginner" as const,
  keywords: ["keyword"],
  relatedTerms: [] as string[],
  lessonSlugs: [] as string[],
};

describe("glossary catalog validation", () => {
  it("accepts the shipped catalog without errors", () => {
    const { terms, errors } = validateGlossaryCatalog(glossaryTerms);
    expect(errors).toEqual([]);
    expect(terms).toHaveLength(glossaryTerms.length);
    expect(terms.length).toBe(104);
  });

  it("covers every declared category with at least one term", () => {
    const counts = countGlossaryTermsByCategory(glossaryTerms);
    for (const category of glossaryCategories) {
      expect(counts[category]).toBeGreaterThan(0);
    }
    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    expect(total).toBe(glossaryTerms.length);
  });

  it("resolves every related term and lesson reference", () => {
    for (const term of glossaryTerms) {
      for (const relatedId of term.relatedTerms) {
        expect(getGlossaryTerm(relatedId)).not.toBeNull();
        expect(relatedId).not.toBe(term.id);
      }
      for (const slug of term.lessonSlugs) {
        expect(getGlossaryLessonTitle(slug)).not.toBeNull();
      }
    }
  });

  it("rejects a non-list input", () => {
    expect(validateGlossaryCatalog("nope").errors).toEqual([
      "The glossary catalog must be a list.",
    ]);
  });

  it("reports invalid records and fields", () => {
    const { terms, errors } = validateGlossaryCatalog([
      null,
      { ...base, id: "ok", term: "Ok" },
      { ...base, id: "bad-category", term: "Bad", category: "Nonsense" },
      { ...base, id: "", term: "No id" },
    ]);
    expect(terms.map((term) => term.id)).toEqual(["ok"]);
    expect(errors).toHaveLength(3);
  });

  it("drops duplicate ids", () => {
    const { terms, errors } = validateGlossaryCatalog([
      { ...base, id: "dup", term: "First" },
      { ...base, id: "dup", term: "Second" },
    ]);
    expect(terms).toHaveLength(1);
    expect(errors).toContainEqual(
      expect.stringContaining('Duplicate glossary term id "dup"'),
    );
  });

  it("drops dangling and self-referential related terms", () => {
    const { terms, errors } = validateGlossaryCatalog([
      { ...base, id: "alpha", term: "Alpha", relatedTerms: ["beta", "ghost"] },
      { ...base, id: "beta", term: "Beta", relatedTerms: ["alpha", "beta"] },
    ]);
    const alpha = terms.find((term) => term.id === "alpha");
    const beta = terms.find((term) => term.id === "beta");
    expect(alpha?.relatedTerms).toEqual(["beta"]);
    expect(beta?.relatedTerms).toEqual(["alpha"]);
    expect(errors).toHaveLength(2);
  });

  it("drops unknown lesson slugs", () => {
    const { terms, errors } = validateGlossaryCatalog([
      {
        ...base,
        id: "alpha",
        term: "Alpha",
        lessonSlugs: ["introduction-to-phishing", "not-a-lesson"],
      },
    ]);
    expect(terms[0].lessonSlugs).toEqual(["introduction-to-phishing"]);
    expect(errors).toHaveLength(1);
  });
});

describe("glossary lookups and search", () => {
  it("looks up terms and their related entries", () => {
    const phishing = getGlossaryTerm("phishing");
    expect(phishing?.term).toBe("Phishing");
    expect(getGlossaryTerm("missing")).toBeNull();

    const related = getRelatedGlossaryTerms(phishing!);
    expect(related.length).toBe(phishing!.relatedTerms.length);
    expect(related.every((term) => term.id !== "phishing")).toBe(true);
  });

  it("filters by category, difficulty, bookmark, and query", () => {
    const phishing = glossaryTerms.filter(
      (term) => term.category === "Phishing",
    );
    expect(
      filterGlossaryTerms(glossaryTerms, {
        query: "",
        category: "Phishing",
        difficulty: "All",
        bookmarkedOnly: false,
        bookmarkedIds: [],
      }),
    ).toHaveLength(phishing.length);

    expect(
      filterGlossaryTerms(glossaryTerms, {
        query: "",
        category: "All",
        difficulty: "Advanced",
        bookmarkedOnly: false,
        bookmarkedIds: [],
      }).every((term) => term.difficulty === "Advanced"),
    ).toBe(true);

    const onlyPhishing = filterGlossaryTerms(glossaryTerms, {
      query: "",
      category: "All",
      difficulty: "All",
      bookmarkedOnly: true,
      bookmarkedIds: ["phishing"],
    });
    expect(onlyPhishing).toHaveLength(1);
    expect(onlyPhishing[0].id).toBe("phishing");
  });

  it("matches queries against term, definition, and keywords", () => {
    const byTerm = filterGlossaryTerms(glossaryTerms, {
      query: "RANSOMWARE",
      category: "All",
      difficulty: "All",
      bookmarkedOnly: false,
      bookmarkedIds: [],
    });
    expect(byTerm.some((term) => term.id === "ransomware")).toBe(true);

    const noMatch = filterGlossaryTerms(glossaryTerms, {
      query: "zzzz-no-such-term",
      category: "All",
      difficulty: "All",
      bookmarkedOnly: false,
      bookmarkedIds: [],
    });
    expect(noMatch).toHaveLength(0);
  });

  it("sorts alphabetically, by category, and by difficulty", () => {
    const alphabetical = sortGlossaryTerms(glossaryTerms, "alphabetical");
    const firstTwo = alphabetical
      .slice(0, 2)
      .map((term) => term.term)
      .map((term) => term.toLocaleLowerCase());
    expect(firstTwo).toEqual([...firstTwo].sort());

    const byDifficulty = sortGlossaryTerms(glossaryTerms, "difficulty");
    expect(byDifficulty[0].difficulty).toBe("Beginner");
    expect(byDifficulty[byDifficulty.length - 1].difficulty).toBe("Advanced");

    const byCategory = sortGlossaryTerms(glossaryTerms, "category");
    const firstCategory = byCategory[0].category;
    expect(firstCategory).toBe(glossaryCategories[0]);
  });

  it("combines filtering and sorting", () => {
    const result = selectGlossaryTerms(
      glossaryTerms,
      {
        query: "",
        category: "Cryptography",
        difficulty: "All",
        bookmarkedOnly: false,
        bookmarkedIds: [],
      },
      "alphabetical",
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((term) => term.category === "Cryptography")).toBe(true);
  });

  it("resolves recently viewed terms in the stored order", () => {
    const recent = getRecentGlossaryTerms(["ransomware", "phishing", "missing"]);
    expect(recent.map((term) => term.id)).toEqual(["ransomware", "phishing"]);
  });
});
