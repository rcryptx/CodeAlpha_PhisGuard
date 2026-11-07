import {
  getRelatedLessons,
  lessonBySlug,
  lessonCategories,
  lessons,
} from "./curriculum";

describe("learning curriculum", () => {
  it("contains all required beginner topics with stable unique slugs", () => {
    expect(lessons).toHaveLength(12);
    expect(new Set(lessons.map((lesson) => lesson.slug)).size).toBe(
      lessons.length,
    );
    expect(lessons.map((lesson) => lesson.title)).toEqual([
      "Introduction to phishing",
      "Email phishing",
      "SMS phishing (smishing)",
      "Voice phishing (vishing)",
      "Spear phishing and targeted attacks",
      "Fake websites and domain spoofing",
      "Malicious links and attachments",
      "Social engineering techniques",
      "Password and account security",
      "Multi-factor authentication",
      "Safe browsing habits",
      "Reporting suspicious activity",
    ]);

    for (const lesson of lessons) {
      expect(lesson.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(lesson.title).toBeTruthy();
      expect(lesson.introduction.length).toBeGreaterThan(80);
      expect(lesson.objectives.length).toBeGreaterThan(0);
      expect(lesson.explanations.length).toBeGreaterThan(0);
      expect(lesson.example.text.length).toBeGreaterThan(40);
      expect(lesson.warningSigns.length).toBeGreaterThan(0);
      expect(lesson.prevention.length).toBeGreaterThan(0);
      expect(lesson.takeaways.length).toBeGreaterThan(0);
      expect(
        lesson.references.every((reference) =>
          reference.url.startsWith("https://"),
        ),
      ).toBe(true);
    }

    expect(lessonCategories.map(({ name }) => name)).toEqual([
      "Recognize",
      "Understand",
      "Protect",
      "Respond",
    ]);
  });

  it("keeps lesson relationships within the curriculum", () => {
    const knownSlugs = new Set(lessons.map((lesson) => lesson.slug));

    for (const lesson of lessons) {
      expect(lesson.relatedLessons.every((slug) => knownSlugs.has(slug))).toBe(
        true,
      );
      expect(getRelatedLessons(lesson).length).toBe(
        lesson.relatedLessons.length,
      );
    }

    expect(lessonBySlug("introduction-to-phishing")?.title).toBe(
      "Introduction to phishing",
    );
    expect(lessonBySlug("unknown-lesson")).toBeUndefined();
  });
});
