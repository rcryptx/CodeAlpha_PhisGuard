import { lessonBySlug } from "@/features/learning/curriculum";

import { glossaryTerms } from "./terms";
import {
  glossaryCategories,
  glossaryDifficulties,
  type GlossaryCategory,
  type GlossaryDifficulty,
  type GlossaryTerm,
} from "./types";

export const glossaryCategoryDescriptions: Record<GlossaryCategory, string> = {
  Phishing:
    "Deceptive messages and calls that try to steal information, money, or access.",
  "Network Security":
    "How data moves between devices and the controls that protect the path.",
  "Authentication and Authorization":
    "Proving who you are and deciding what you are allowed to do.",
  "Web Security":
    "Weaknesses and protections in websites, browsers, and web requests.",
  "Social Engineering":
    "Manipulating people, rather than systems, into taking unsafe actions.",
  "Malware and Threats":
    "Malicious software families and the ways they spread and persist.",
  "Email Security":
    "Standards and signals that help verify who really sent a message.",
  Cryptography:
    "Mathematical techniques for confidentiality, integrity, and authenticity.",
  "Privacy and Data Protection":
    "Handling personal information lawfully, minimally, and safely.",
  "Operating System Security":
    "Hardening, patching, and controlling software on computers and servers.",
  "Security Operations and Incident Response":
    "Detecting, investigating, and recovering from security events.",
  "Cybersecurity Standards and Concepts":
    "Foundational models, metrics, and vocabulary used across the field.",
};

export const difficultyOrder: Record<GlossaryDifficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

export type GlossarySortKey = "alphabetical" | "category" | "difficulty";

export const glossarySortOptions: {
  value: GlossarySortKey;
  label: string;
}[] = [
  { value: "alphabetical", label: "A to Z" },
  { value: "category", label: "Category" },
  { value: "difficulty", label: "Difficulty" },
];

export type GlossaryValidationResult = {
  terms: GlossaryTerm[];
  errors: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isGlossaryCategory(
  value: unknown,
): value is GlossaryCategory {
  return glossaryCategories.some((category) => category === value);
}

export function isGlossaryDifficulty(
  value: unknown,
): value is GlossaryDifficulty {
  return glossaryDifficulties.some((difficulty) => difficulty === value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Validates a raw glossary catalog.
 *
 * Records with missing fields, unknown categories or difficulties, duplicate
 * ids, unsafe lesson slugs, or dangling cross-references are reported and
 * excluded. Related-term references to unknown ids (and self-references) are
 * dropped so the shipped catalog stays internally consistent at runtime while
 * authoring mistakes surface as errors in tests.
 */
export function validateGlossaryCatalog(
  input: unknown,
): GlossaryValidationResult {
  if (!Array.isArray(input)) {
    return { terms: [], errors: ["The glossary catalog must be a list."] };
  }

  const errors: string[] = [];
  const seen = new Set<string>();
  const candidates: GlossaryTerm[] = [];

  for (const [index, value] of input.entries()) {
    if (!isRecord(value)) {
      errors.push(`Glossary term ${index + 1} is not a valid record.`);
      continue;
    }

    if (
      !isNonEmptyString(value.id) ||
      !isNonEmptyString(value.term) ||
      !isNonEmptyString(value.definition) ||
      !isNonEmptyString(value.explanation) ||
      !isNonEmptyString(value.example) ||
      !isGlossaryCategory(value.category) ||
      !isGlossaryDifficulty(value.difficulty) ||
      !isStringArray(value.keywords) ||
      !isStringArray(value.relatedTerms) ||
      !isStringArray(value.lessonSlugs)
    ) {
      errors.push(`Glossary term ${index + 1} has missing or invalid fields.`);
      continue;
    }

    if (seen.has(value.id)) {
      errors.push(`Duplicate glossary term id "${value.id}" was ignored.`);
      continue;
    }
    seen.add(value.id);

    candidates.push({
      id: value.id,
      term: value.term,
      definition: value.definition,
      explanation: value.explanation,
      example: value.example,
      category: value.category,
      difficulty: value.difficulty,
      keywords: value.keywords,
      relatedTerms: value.relatedTerms,
      lessonSlugs: value.lessonSlugs,
    });
  }

  const knownIds = new Set(candidates.map((term) => term.id));
  const terms: GlossaryTerm[] = [];

  for (const term of candidates) {
    const relatedTerms = term.relatedTerms.filter(
      (id) => id !== term.id && knownIds.has(id),
    );
    if (relatedTerms.length !== term.relatedTerms.length) {
      errors.push(
        `Glossary term "${term.id}" references an unknown or self-referential related term.`,
      );
    }

    const lessonSlugs = term.lessonSlugs.filter(
      (slug) => lessonBySlug(slug) !== undefined,
    );
    if (lessonSlugs.length !== term.lessonSlugs.length) {
      errors.push(
        `Glossary term "${term.id}" references a lesson that does not exist.`,
      );
    }

    terms.push({ ...term, relatedTerms, lessonSlugs });
  }

  return { terms, errors };
}

export function getGlossaryTerm(
  id: string,
  terms: GlossaryTerm[] = glossaryTerms,
): GlossaryTerm | null {
  return terms.find((term) => term.id === id) ?? null;
}

export function getRelatedGlossaryTerms(
  term: GlossaryTerm,
  terms: GlossaryTerm[] = glossaryTerms,
): GlossaryTerm[] {
  return term.relatedTerms
    .map((id) => getGlossaryTerm(id, terms))
    .filter((related): related is GlossaryTerm => related !== null);
}

export function getGlossaryLessonTitle(slug: string): string | null {
  return lessonBySlug(slug)?.title ?? null;
}

export function countGlossaryTermsByCategory(
  terms: GlossaryTerm[] = glossaryTerms,
): Record<GlossaryCategory, number> {
  const counts = Object.fromEntries(
    glossaryCategories.map((category) => [category, 0]),
  ) as Record<GlossaryCategory, number>;
  for (const term of terms) {
    counts[term.category] += 1;
  }
  return counts;
}

export interface GlossaryFilter {
  query: string;
  category: GlossaryCategory | "All";
  difficulty: GlossaryDifficulty | "All";
  bookmarkedOnly: boolean;
  bookmarkedIds: string[];
}

export function filterGlossaryTerms(
  terms: GlossaryTerm[],
  filter: GlossaryFilter,
): GlossaryTerm[] {
  const normalizedQuery = filter.query.trim().toLocaleLowerCase();
  const bookmarked = new Set(filter.bookmarkedIds);

  return terms.filter((term) => {
    const matchesCategory =
      filter.category === "All" || term.category === filter.category;
    const matchesDifficulty =
      filter.difficulty === "All" || term.difficulty === filter.difficulty;
    const matchesBookmark =
      !filter.bookmarkedOnly || bookmarked.has(term.id);
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        term.term,
        term.definition,
        term.explanation,
        term.category,
        term.difficulty,
        term.keywords.join(" "),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);

    return (
      matchesCategory && matchesDifficulty && matchesBookmark && matchesQuery
    );
  });
}

export function sortGlossaryTerms(
  terms: GlossaryTerm[],
  sortKey: GlossarySortKey,
): GlossaryTerm[] {
  const sorted = [...terms];
  if (sortKey === "alphabetical") {
    sorted.sort((left, right) => left.term.localeCompare(right.term));
  } else if (sortKey === "category") {
    sorted.sort((left, right) => {
      const categoryDelta =
        glossaryCategories.indexOf(left.category) -
        glossaryCategories.indexOf(right.category);
      return categoryDelta !== 0
        ? categoryDelta
        : left.term.localeCompare(right.term);
    });
  } else {
    sorted.sort((left, right) => {
      const difficultyDelta =
        difficultyOrder[left.difficulty] - difficultyOrder[right.difficulty];
      return difficultyDelta !== 0
        ? difficultyDelta
        : left.term.localeCompare(right.term);
    });
  }
  return sorted;
}

export function selectGlossaryTerms(
  terms: GlossaryTerm[],
  filter: GlossaryFilter,
  sortKey: GlossarySortKey,
): GlossaryTerm[] {
  return sortGlossaryTerms(filterGlossaryTerms(terms, filter), sortKey);
}

export function getRecentGlossaryTerms(
  recentIds: string[],
  terms: GlossaryTerm[] = glossaryTerms,
): GlossaryTerm[] {
  return recentIds
    .map((id) => getGlossaryTerm(id, terms))
    .filter((term): term is GlossaryTerm => term !== null);
}
