import { lessons } from "@/features/learning/curriculum";

import {
  emptyProgress,
  getProgressSummary,
  parseProgressData,
  PROGRESS_SCHEMA_VERSION,
  type StoredProgress,
} from "./progressData";

describe("progress persistence data", () => {
  it("starts with empty progress", () => {
    expect(parseProgressData(null)).toEqual({
      data: emptyProgress,
      storageNotice: null,
    });
    expect(
      getProgressSummary(emptyProgress, Date.parse("2026-01-10T00:00:00.000Z")),
    ).toEqual({
      totalLessons: lessons.length,
      completedLessons: 0,
      lessonsRemaining: lessons.length,
      completionPercentage: 0,
      recentlyCompleted: [],
      completedInRecentWindow: 0,
      lastActivityAt: null,
    });
  });

  it("rejects malformed, outdated, and structurally invalid stored values safely", () => {
    expect(parseProgressData("{broken").storageNotice).toMatch(
      /could not be read/,
    );
    expect(
      parseProgressData(JSON.stringify({ version: 99, completedLessons: [] }))
        .storageNotice,
    ).toMatch(/unsupported format/);
    expect(
      parseProgressData(
        JSON.stringify({
          version: PROGRESS_SCHEMA_VERSION,
          completedLessons: null,
        }),
      ).storageNotice,
    ).toMatch(/invalid lesson list/);
  });

  it("filters removed slugs and invalid records and deduplicates by latest valid completion", () => {
    const slug = lessons[0].slug;
    const older = "2026-01-01T10:00:00.000Z";
    const newer = "2026-01-02T10:00:00.000Z";
    const parsed = parseProgressData(
      JSON.stringify({
        version: PROGRESS_SCHEMA_VERSION,
        completedLessons: [
          { lessonSlug: slug, completedAt: older },
          { lessonSlug: slug, completedAt: newer },
          { lessonSlug: "removed-lesson", completedAt: newer },
          { lessonSlug: lessons[1].slug, completedAt: "not-a-date" },
          { lessonSlug: 12, completedAt: newer },
        ],
      }),
    );

    expect(parsed.data.completedLessons).toEqual([
      { lessonSlug: slug, completedAt: newer },
    ]);
    expect(parsed.storageNotice).toMatch(/3 invalid or outdated/);
    expect(
      getProgressSummary(parsed.data, Date.parse("2026-01-03T00:00:00.000Z"))
        .completedLessons,
    ).toBe(1);
  });

  it("calculates completion, recent activity, and ordering from stored completions", () => {
    const now = Date.parse("2026-02-20T12:00:00.000Z");
    const data: StoredProgress = {
      version: PROGRESS_SCHEMA_VERSION,
      completedLessons: [
        {
          lessonSlug: lessons[0].slug,
          completedAt: "2026-02-19T12:00:00.000Z",
        },
        {
          lessonSlug: lessons[1].slug,
          completedAt: "2026-02-01T12:00:00.000Z",
        },
        {
          lessonSlug: lessons[2].slug,
          completedAt: "2026-02-18T12:00:00.000Z",
        },
      ],
    };

    expect(getProgressSummary(data, now)).toEqual({
      totalLessons: lessons.length,
      completedLessons: 3,
      lessonsRemaining: lessons.length - 3,
      completionPercentage: 25,
      recentlyCompleted: [
        {
          lessonSlug: lessons[0].slug,
          completedAt: "2026-02-19T12:00:00.000Z",
        },
        {
          lessonSlug: lessons[2].slug,
          completedAt: "2026-02-18T12:00:00.000Z",
        },
        {
          lessonSlug: lessons[1].slug,
          completedAt: "2026-02-01T12:00:00.000Z",
        },
      ],
      completedInRecentWindow: 2,
      lastActivityAt: "2026-02-19T12:00:00.000Z",
    });
  });
});
