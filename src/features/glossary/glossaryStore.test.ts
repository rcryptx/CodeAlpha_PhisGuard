import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  GLOSSARY_BOOKMARKS_KEY,
  GLOSSARY_RECENT_KEY,
  MAX_RECENT_TERMS,
} from "./glossaryStorage";

describe("glossary store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it("toggles bookmarks and persists them", async () => {
    const store = await import("./glossaryStore");
    store.clearBookmarks();
    expect(store.getGlossarySnapshot().bookmarkedIds).toEqual([]);

    store.toggleBookmark("phishing");
    expect(store.isTermBookmarked("phishing")).toBe(true);
    expect(
      JSON.parse(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY)!),
    ).toEqual({ version: 1, ids: ["phishing"] });

    store.toggleBookmark("phishing");
    expect(store.isTermBookmarked("phishing")).toBe(false);
  });

  it("records recently viewed terms, deduping and capping the list", async () => {
    const store = await import("./glossaryStore");
    store.clearRecentTerms();

    store.recordTermView("phishing");
    store.recordTermView("firewall");
    store.recordTermView("phishing");
    expect(store.getGlossarySnapshot().recentTermIds).toEqual([
      "phishing",
      "firewall",
    ]);

    for (const id of [
      "ransomware",
      "malware",
      "virus",
      "worm",
      "trojan-horse",
      "spyware",
      "keylogger",
      "botnet",
      "hashing",
    ]) {
      store.recordTermView(id);
    }
    const recent = store.getGlossarySnapshot().recentTermIds;
    expect(recent).toHaveLength(MAX_RECENT_TERMS);
    expect(recent[0]).toBe("hashing");
  });

  it("keeps bookmarks and recently viewed terms independent", async () => {
    const store = await import("./glossaryStore");
    store.clearBookmarks();
    store.clearRecentTerms();

    store.toggleBookmark("hashing");
    store.recordTermView("hashing");

    expect(store.getGlossarySnapshot().bookmarkedIds).toEqual(["hashing"]);
    expect(store.getGlossarySnapshot().recentTermIds).toEqual(["hashing"]);
    expect(window.localStorage.getItem(GLOSSARY_RECENT_KEY)).toContain(
      "hashing",
    );
  });

  it("rejects unknown terms", async () => {
    const store = await import("./glossaryStore");
    expect(() => store.toggleBookmark("not-a-term")).toThrow(
      /unknown glossary term/,
    );
    expect(() => store.recordTermView("not-a-term")).toThrow(
      /unknown glossary term/,
    );
  });

  it("notifies subscribers when state changes", async () => {
    const store = await import("./glossaryStore");
    const listener = vi.fn();
    const unsubscribe = store.subscribeToGlossary(listener);

    store.toggleBookmark("phishing");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.toggleBookmark("firewall");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
