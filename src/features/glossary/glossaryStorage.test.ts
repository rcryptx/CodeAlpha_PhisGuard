import { describe, expect, it } from "vitest";

import {
  GLOSSARY_SCHEMA_VERSION,
  parseStoredIdList,
  serializeBookmarks,
  serializeRecentTerms,
} from "./glossaryStorage";

describe("glossary storage parsing", () => {
  it("returns an empty list without a notice when nothing is stored", () => {
    expect(parseStoredIdList(null, { label: "bookmarks" })).toEqual({
      ids: [],
      storageNotice: null,
    });
  });

  it("round-trips serialized ids", () => {
    const raw = serializeBookmarks(["phishing", "firewall"]);
    expect(JSON.parse(raw)).toEqual({
      version: GLOSSARY_SCHEMA_VERSION,
      ids: ["phishing", "firewall"],
    });
    expect(parseStoredIdList(raw, { label: "bookmarks" })).toEqual({
      ids: ["phishing", "firewall"],
      storageNotice: null,
    });
    expect(
      parseStoredIdList(serializeRecentTerms(["phishing"]), {
        label: "recently viewed terms",
      }).ids,
    ).toEqual(["phishing"]);
  });

  it("recovers from unreadable data with a notice", () => {
    const parsed = parseStoredIdList("{not json", { label: "bookmarks" });
    expect(parsed.ids).toEqual([]);
    expect(parsed.storageNotice).toMatch(/could not be read/);
  });

  it("rejects unsupported formats", () => {
    const parsed = parseStoredIdList(
      JSON.stringify({ version: 99, ids: ["phishing"] }),
      { label: "bookmarks" },
    );
    expect(parsed.ids).toEqual([]);
    expect(parsed.storageNotice).toMatch(/unsupported format/);
  });

  it("drops unknown and duplicate ids with a single notice", () => {
    const parsed = parseStoredIdList(
      JSON.stringify({
        version: GLOSSARY_SCHEMA_VERSION,
        ids: ["phishing", "phishing", "not-a-term", 42],
      }),
      { label: "bookmarks" },
    );
    expect(parsed.ids).toEqual(["phishing"]);
    expect(parsed.storageNotice).toMatch(/3 invalid saved bookmarks/);
  });

  it("applies an optional limit", () => {
    const parsed = parseStoredIdList(
      serializeRecentTerms(["phishing", "firewall", "ransomware"]),
      { label: "recently viewed terms", limit: 2 },
    );
    expect(parsed.ids).toEqual(["phishing", "firewall"]);
  });
});
