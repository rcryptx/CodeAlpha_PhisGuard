import { describe, expect, it } from "vitest";

import {
  filterResources,
  resourceCatalog,
  validateResourceCatalog,
} from "./resourceData";

describe("resource catalogue data", () => {
  it("accepts the curated resource records and known lesson relationships", () => {
    const result = validateResourceCatalog(resourceCatalog);

    expect(result.errors).toEqual([]);
    expect(result.resources).toHaveLength(6);
    expect(
      result.resources.every((resource) =>
        resource.lessonSlugs.every((slug) => slug.length > 0),
      ),
    ).toBe(true);
  });

  it("omits malformed, duplicate, unsafe, and stale records", () => {
    const invalidCatalog: unknown[] = [
      null,
      resourceCatalog[0],
      resourceCatalog[0],
      {
        ...resourceCatalog[0],
        id: "javascript-url",
        url: "javascript:alert(1)",
      },
      {
        ...resourceCatalog[0],
        id: "missing-lesson",
        lessonSlugs: ["removed-lesson"],
      },
      {
        id: "incomplete",
        title: "Incomplete entry",
      },
    ];
    const result = validateResourceCatalog(invalidCatalog);

    expect(result.resources).toHaveLength(1);
    expect(result.resources[0].id).toBe("cisa-phishing");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("filters by topic and search text and returns no results for unmatched queries", () => {
    expect(
      filterResources(resourceCatalog, "Account security", ""),
    ).toHaveLength(2);
    expect(
      filterResources(resourceCatalog, "All", "national cyber security"),
    ).toHaveLength(1);
    expect(filterResources(resourceCatalog, "Reporting", "password")).toEqual(
      [],
    );
  });
});
