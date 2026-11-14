import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  GLOSSARY_BOOKMARKS_KEY,
  GLOSSARY_RECENT_KEY,
  MAX_RECENT_TERMS,
} from "./glossaryStorage";

function failWritesTo(key: string) {
  const original = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
    this: Storage,
    storageKey: string,
    value: string,
  ) {
    if (storageKey === key) {
      throw new DOMException("Storage is full", "QuotaExceededError");
    }
    return original.call(this, storageKey, value);
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

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

describe("glossary store resilience", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it("does not report a failed save as successful on the next snapshot read", async () => {
    const store = await import("./glossaryStore");
    failWritesTo(GLOSSARY_RECENT_KEY);

    store.recordTermView("phishing");

    expect(store.getGlossarySnapshot().recentTermIds).toEqual(["phishing"]);
    expect(store.getGlossarySnapshot().storageNotice).toMatch(/could not save/);

    // A later read must not treat the unpersisted change as a successful save.
    const later = store.getGlossarySnapshot();
    expect(later.recentTermIds).toEqual(["phishing"]);
    expect(later.storageNotice).toMatch(/could not save/);
    expect(window.localStorage.getItem(GLOSSARY_RECENT_KEY)).toBeNull();
  });

  it("keeps a failed bookmark save visible and unsaved", async () => {
    const store = await import("./glossaryStore");
    failWritesTo(GLOSSARY_BOOKMARKS_KEY);

    store.toggleBookmark("phishing");

    expect(store.getGlossarySnapshot().bookmarkedIds).toEqual(["phishing"]);
    expect(store.getGlossarySnapshot().storageNotice).toMatch(/could not save/);
    expect(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY)).toBeNull();
  });

  it("changes a bookmark without rewriting the recently viewed key", async () => {
    const store = await import("./glossaryStore");
    store.recordTermView("firewall");

    const setItem = vi.spyOn(Storage.prototype, "setItem");
    store.toggleBookmark("phishing");

    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith(
      GLOSSARY_BOOKMARKS_KEY,
      expect.any(String),
    );
  });

  it("records a view without rewriting the bookmarks key", async () => {
    const store = await import("./glossaryStore");
    store.getGlossarySnapshot();
    window.localStorage.setItem(
      GLOSSARY_BOOKMARKS_KEY,
      JSON.stringify({ version: 1, ids: ["phishing"] }),
    );

    const setItem = vi.spyOn(Storage.prototype, "setItem");
    store.recordTermView("firewall");

    expect(setItem).not.toHaveBeenCalledWith(
      GLOSSARY_BOOKMARKS_KEY,
      expect.any(String),
    );
    expect(
      JSON.parse(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY)!),
    ).toEqual({ version: 1, ids: ["phishing"] });
  });

  it("does not let a stale second tab erase a saved bookmark", async () => {
    vi.resetModules();
    const firstTab = await import("./glossaryStore");
    vi.resetModules();
    const secondTab = await import("./glossaryStore");

    secondTab.getGlossarySnapshot();
    firstTab.toggleBookmark("phishing");

    secondTab.recordTermView("firewall");

    expect(
      JSON.parse(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY)!),
    ).toEqual({ version: 1, ids: ["phishing"] });
    expect(
      JSON.parse(window.localStorage.getItem(GLOSSARY_RECENT_KEY)!),
    ).toEqual({ version: 1, ids: ["firewall"] });
  });

  it("syncs bookmarks written by another tab through the storage event", async () => {
    const store = await import("./glossaryStore");
    store.getGlossarySnapshot();

    const value = JSON.stringify({ version: 1, ids: ["phishing"] });
    window.localStorage.setItem(GLOSSARY_BOOKMARKS_KEY, value);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: GLOSSARY_BOOKMARKS_KEY,
        newValue: value,
      }),
    );

    expect(store.getGlossarySnapshot().bookmarkedIds).toEqual(["phishing"]);
  });

  it("preserves malformed bookmark data when recording a view", async () => {
    const corrupt = "{not json";
    window.localStorage.setItem(GLOSSARY_BOOKMARKS_KEY, corrupt);
    const store = await import("./glossaryStore");

    store.recordTermView("phishing");

    expect(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY)).toBe(corrupt);
    expect(store.getGlossarySnapshot().storageNotice).toMatch(
      /could not be read/,
    );
  });

  it("preserves unsupported-version bookmarks when recording a view", async () => {
    const unsupported = JSON.stringify({ version: 2, ids: ["phishing"] });
    window.localStorage.setItem(GLOSSARY_BOOKMARKS_KEY, unsupported);
    const store = await import("./glossaryStore");

    store.recordTermView("firewall");

    expect(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY)).toBe(
      unsupported,
    );
    expect(store.getGlossarySnapshot().bookmarkedIds).toEqual([]);
    expect(store.getGlossarySnapshot().storageNotice).toMatch(
      /unsupported format/,
    );
  });

  it("preserves malformed recent-history data when toggling a bookmark", async () => {
    const corrupt = "[1, 2";
    window.localStorage.setItem(GLOSSARY_RECENT_KEY, corrupt);
    const store = await import("./glossaryStore");

    store.toggleBookmark("phishing");

    expect(window.localStorage.getItem(GLOSSARY_RECENT_KEY)).toBe(corrupt);
    expect(store.getGlossarySnapshot().bookmarkedIds).toEqual(["phishing"]);
    expect(store.getGlossarySnapshot().storageNotice).toMatch(
      /could not be read/,
    );
  });

  it("ignores unknown saved ids without rewriting unrelated storage", async () => {
    const raw = JSON.stringify({
      version: 1,
      ids: ["phishing", "not-a-term"],
    });
    window.localStorage.setItem(GLOSSARY_BOOKMARKS_KEY, raw);
    const store = await import("./glossaryStore");

    expect(store.getGlossarySnapshot().bookmarkedIds).toEqual(["phishing"]);
    expect(store.getGlossarySnapshot().storageNotice).toMatch(
      /invalid saved bookmarks/,
    );

    store.recordTermView("firewall");

    expect(window.localStorage.getItem(GLOSSARY_BOOKMARKS_KEY)).toBe(raw);
  });
});
