export const glossaryCategories = [
  "Phishing",
  "Network Security",
  "Authentication and Authorization",
  "Web Security",
  "Social Engineering",
  "Malware and Threats",
  "Email Security",
  "Cryptography",
  "Privacy and Data Protection",
  "Operating System Security",
  "Security Operations and Incident Response",
  "Cybersecurity Standards and Concepts",
] as const;

export type GlossaryCategory = (typeof glossaryCategories)[number];

export const glossaryDifficulties = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export type GlossaryDifficulty = (typeof glossaryDifficulties)[number];

export interface GlossaryTerm {
  /** Stable identifier used in routes, storage, and cross-references. */
  id: string;
  term: string;
  /** Concise, accurate definition of the term. */
  definition: string;
  /** Plain-language explanation for readers new to the topic. */
  explanation: string;
  /** Practical, illustrative real-world example. */
  example: string;
  category: GlossaryCategory;
  difficulty: GlossaryDifficulty;
  /** Keywords and synonyms used by search. */
  keywords: string[];
  /** Ids of closely related glossary terms. */
  relatedTerms: string[];
  /** Slugs of relevant PhisGuard lessons in the learning centre. */
  lessonSlugs: string[];
}
