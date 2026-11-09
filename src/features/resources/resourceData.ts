import { lessonBySlug } from "@/features/learning/curriculum";

export const resourceCategories = [
  "Phishing",
  "Account security",
  "Safe browsing",
  "Reporting",
] as const;

export type ResourceCategory = (typeof resourceCategories)[number];
export type ResourceKind = "Official guidance" | "PhisGuard lesson";

export interface LearningResource {
  id: string;
  title: string;
  source: string;
  description: string;
  category: ResourceCategory;
  kind: ResourceKind;
  url: string;
  lessonSlugs: string[];
}

export const resourceCatalog: LearningResource[] = [
  {
    id: "cisa-phishing",
    title: "Recognize and report phishing",
    source: "Cybersecurity and Infrastructure Security Agency (CISA)",
    description:
      "Practical advice for recognizing suspicious messages and responding safely.",
    category: "Phishing",
    kind: "Official guidance",
    url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
    lessonSlugs: ["introduction-to-phishing", "email-phishing"],
  },
  {
    id: "ncsc-phishing",
    title: "Phishing scams: how to spot and report them",
    source: "UK National Cyber Security Centre (NCSC)",
    description:
      "Guidance on identifying and reporting suspicious emails, texts, websites, and calls.",
    category: "Phishing",
    kind: "Official guidance",
    url: "https://www.ncsc.gov.uk/collection/phishing-scams",
    lessonSlugs: ["sms-phishing-smishing", "voice-phishing-vishing"],
  },
  {
    id: "cisa-mfa",
    title: "Turn on multifactor authentication",
    source: "Cybersecurity and Infrastructure Security Agency (CISA)",
    description:
      "Learn how multifactor authentication adds protection to important accounts.",
    category: "Account security",
    kind: "Official guidance",
    url: "https://www.cisa.gov/secure-our-world/turn-mfa",
    lessonSlugs: ["multi-factor-authentication"],
  },
  {
    id: "cisa-passwords",
    title: "Use strong passwords",
    source: "Cybersecurity and Infrastructure Security Agency (CISA)",
    description:
      "Guidance on unique passwords, passphrases, and using a password manager.",
    category: "Account security",
    kind: "Official guidance",
    url: "https://www.cisa.gov/secure-our-world/use-strong-passwords",
    lessonSlugs: ["password-and-account-security"],
  },
  {
    id: "lesson-safe-browsing",
    title: "Safe browsing habits",
    source: "PhisGuard Learning Centre",
    description:
      "Review practical habits for checking links and navigating the web more safely.",
    category: "Safe browsing",
    kind: "PhisGuard lesson",
    url: "/learn/safe-browsing-habits",
    lessonSlugs: ["safe-browsing-habits"],
  },
  {
    id: "lesson-reporting",
    title: "Reporting suspicious activity",
    source: "PhisGuard Learning Centre",
    description:
      "Learn what to do when a message or account activity seems suspicious.",
    category: "Reporting",
    kind: "PhisGuard lesson",
    url: "/learn/reporting-suspicious-activity",
    lessonSlugs: ["reporting-suspicious-activity"],
  },
];

export type ResourceValidationResult = {
  resources: LearningResource[];
  errors: string[];
};

function isResourceCategory(value: unknown): value is ResourceCategory {
  return resourceCategories.some((category) => category === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateResourceCatalog(
  input: unknown,
): ResourceValidationResult {
  if (!Array.isArray(input)) {
    return { resources: [], errors: ["The resource catalog must be a list."] };
  }

  const resources: LearningResource[] = [];
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const [index, value] of input.entries()) {
    if (!isRecord(value)) {
      errors.push(`Resource ${index + 1} is not a valid record.`);
      continue;
    }

    const resource = value;
    if (
      typeof resource.id !== "string" ||
      resource.id.trim() === "" ||
      typeof resource.title !== "string" ||
      resource.title.trim() === "" ||
      typeof resource.source !== "string" ||
      resource.source.trim() === "" ||
      typeof resource.description !== "string" ||
      resource.description.trim() === "" ||
      !isResourceCategory(resource.category) ||
      (resource.kind !== "Official guidance" &&
        resource.kind !== "PhisGuard lesson") ||
      typeof resource.url !== "string" ||
      !Array.isArray(resource.lessonSlugs)
    ) {
      errors.push(`Resource ${index + 1} has missing or invalid fields.`);
      continue;
    }
    if (ids.has(resource.id)) {
      errors.push(`Duplicate resource id "${resource.id}" was ignored.`);
      continue;
    }

    const internal = resource.kind === "PhisGuard lesson";
    let safeUrl = false;
    if (internal) {
      safeUrl =
        resource.url.startsWith("/learn/") &&
        lessonBySlug(resource.url.slice("/learn/".length)) !== undefined;
    } else {
      try {
        const url = new URL(resource.url);
        safeUrl =
          url.protocol === "https:" &&
          url.username === "" &&
          url.password === "";
      } catch {
        safeUrl = false;
      }
    }
    const validLessonSlugs = resource.lessonSlugs.filter(
      (slug): slug is string =>
        typeof slug === "string" && lessonBySlug(slug) !== undefined,
    );
    if (!safeUrl || validLessonSlugs.length !== resource.lessonSlugs.length) {
      errors.push(`Resource "${resource.id}" has an unsafe link or lesson.`);
      continue;
    }

    ids.add(resource.id);
    resources.push({
      id: resource.id,
      title: resource.title,
      source: resource.source,
      description: resource.description,
      category: resource.category,
      kind: resource.kind,
      url: resource.url,
      lessonSlugs: validLessonSlugs,
    });
  }

  return { resources, errors };
}

export function filterResources(
  resources: LearningResource[],
  category: ResourceCategory | "All",
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return resources.filter((resource) => {
    const matchesCategory =
      category === "All" || resource.category === category;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${resource.title} ${resource.source} ${resource.description} ${resource.category}`
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

export function getResourceLessonTitle(slug: string) {
  return lessonBySlug(slug)?.title ?? null;
}
