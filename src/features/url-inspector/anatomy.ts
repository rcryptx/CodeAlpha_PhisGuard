import { getHostnameLabels, isIpLiteralHost, splitRegistrableDomain } from "./hostname";
import type { ParsedUrlInput, UrlAnatomy } from "./types";

function hasNonAscii(value: string) {
  return value.split("").some((character) => character.charCodeAt(0) > 0x7f);
}

/**
 * Build a structural breakdown of a successfully parsed URL.
 * This is descriptive only: it makes no safety judgement.
 */
export function buildUrlAnatomy(parsed: ParsedUrlInput): UrlAnatomy {
  const { url, raw, rawAuthority, rawHostname, pathAndQuery } = parsed;
  const hostname = url.hostname;
  const { subdomain, registrableDomain } = splitRegistrableDomain(hostname);
  const labels = getHostnameLabels(hostname).map((label) => label.toLowerCase());

  return {
    protocol: url.protocol,
    hasAuthority: rawAuthority.length > 0,
    userinfoPresent:
      Boolean(url.username || url.password) || rawAuthority.includes("@"),
    hostname,
    subdomain,
    registrableDomain,
    port: url.port,
    isIpHost: isIpLiteralHost(hostname),
    isPunycode: labels.some((label) => label.startsWith("xn--")),
    hasUnicodeInput: hasNonAscii(rawHostname),
    path: url.pathname,
    hasQuery: url.search.length > 0,
    queryParameterNames: [...url.searchParams.keys()],
    hasFragment: url.hash.length > 0,
    percentEncodedOctets: (pathAndQuery.match(/%[0-9a-f]{2}/gi) ?? []).length,
    characterLength: raw.length,
  };
}
