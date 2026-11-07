import type { ParsedUrlInput } from "./types";

const schemePattern = /^([a-z][a-z\d+.-]*):/i;
const webAuthorityPattern = /^[a-z][a-z\d+.-]*:\/\/([^/?#]*)/i;

export type UrlParseResult =
  | { success: true; parsed: ParsedUrlInput }
  | { success: false; protocol?: string; error: string };

function extractRawHostname(authority: string) {
  const withoutCredentials = authority.slice(authority.lastIndexOf("@") + 1);
  if (withoutCredentials.startsWith("[")) {
    const closingBracket = withoutCredentials.indexOf("]");
    return closingBracket === -1
      ? withoutCredentials
      : withoutCredentials.slice(0, closingBracket + 1);
  }

  const portSeparator = withoutCredentials.lastIndexOf(":");
  return portSeparator === -1
    ? withoutCredentials
    : withoutCredentials.slice(0, portSeparator);
}

export function parseUrlInput(input: string): UrlParseResult {
  const raw = input.trim();
  if (!raw) {
    return { success: false, error: "Enter a URL to analyze." };
  }

  if (
    raw
      .split("")
      .some(
        (character) =>
          character.charCodeAt(0) <= 0x1f || character.charCodeAt(0) === 0x7f,
      )
  ) {
    return {
      success: false,
      error: "The URL contains control characters and cannot be analyzed.",
    };
  }

  const scheme = raw.match(schemePattern)?.[1]?.toLowerCase();
  if (!scheme) {
    return {
      success: false,
      error:
        "Enter a complete URL including its scheme, such as https://example.com.",
    };
  }

  if (
    (scheme === "http" || scheme === "https") &&
    !webAuthorityPattern.test(raw)
  ) {
    return {
      success: false,
      protocol: scheme,
      error:
        "HTTP URLs must include // and a hostname, for example https://example.com.",
    };
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return {
      success: false,
      protocol: scheme,
      error:
        "This does not appear to be a valid absolute URL. Check its scheme, hostname, and port.",
    };
  }

  const authority = raw.match(webAuthorityPattern)?.[1] ?? "";
  const rawHostname = extractRawHostname(authority);

  return {
    success: true,
    parsed: {
      raw,
      url,
      rawAuthority: authority,
      rawHostname,
      pathAndQuery: `${url.pathname}${url.search}`,
    },
  };
}

export function sanitizeUrlForDisplay(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return `${url.protocol}[destination omitted]`;
  }

  const path = url.pathname === "/" ? "" : "/[path omitted]";
  return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}${path}${url.search ? "?[query omitted]" : ""}`;
}
