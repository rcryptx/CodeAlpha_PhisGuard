import { glossaryTerms } from "./terms";

export const GLOSSARY_SCHEMA_VERSION = 1;
export const GLOSSARY_BOOKMARKS_KEY = "phisguard.glossary-bookmarks";
export const GLOSSARY_RECENT_KEY = "phisguard.glossary-recent";
export const MAX_RECENT_TERMS = 8;

const knownTermIds = new Set(glossaryTerms.map((term) => term.id));

export interface StoredIdList {
  version: typeof GLOSSARY_SCHEMA_VERSION;
  ids: string[];
}

export interface ParsedIdList {
  ids: string[];
  storageNotice: string | null;
  /**
   * Whether the stored value was successfully interpreted and may therefore be
   * safely replaced. Unreadable or unsupported-version data is reported as
   * untrusted so callers can avoid overwriting data they do not understand.
   */
  trusted: boolean;
}

function serialize(ids: string[]): StoredIdList {
  return { version: GLOSSARY_SCHEMA_VERSION, ids };
}

export function serializeBookmarks(ids: string[]): string {
  return JSON.stringify(serialize(ids));
}

export function serializeRecentTerms(ids: string[]): string {
  return JSON.stringify(serialize(ids));
}

/**
 * Parses a stored list of glossary term ids.
 *
 * Unknown, duplicated, or non-string entries are dropped. Unreadable or
 * unsupported data yields an empty list plus a human-readable notice rather
 * than throwing, and the original browser value is left untouched.
 */
export function parseStoredIdList(
  raw: string | null,
  options: { limit?: number; label: string },
): ParsedIdList {
  if (raw === null) {
    return { ids: [], storageNotice: null, trusted: true };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ids: [],
      storageNotice: `Saved ${options.label} could not be read, so it is starting empty. Existing browser data was left unchanged.`,
      trusted: false,
    };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("version" in parsed) ||
    (parsed as { version?: unknown }).version !== GLOSSARY_SCHEMA_VERSION ||
    !("ids" in parsed) ||
    !Array.isArray((parsed as { ids?: unknown }).ids)
  ) {
    return {
      ids: [],
      storageNotice: `Saved ${options.label} uses an unsupported format, so it is starting empty. The stored data was left unchanged.`,
      trusted: false,
    };
  }

  let discarded = 0;
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const value of (parsed as { ids: unknown[] }).ids) {
    if (
      typeof value !== "string" ||
      !knownTermIds.has(value) ||
      seen.has(value)
    ) {
      discarded += 1;
      continue;
    }
    seen.add(value);
    ids.push(value);
  }

  const limited =
    options.limit === undefined ? ids : ids.slice(0, options.limit);

  return {
    ids: limited,
    storageNotice:
      discarded > 0
        ? `${discarded} invalid saved ${options.label} entr${discarded === 1 ? "y was" : "ies were"} ignored.`
        : null,
    trusted: true,
  };
}
