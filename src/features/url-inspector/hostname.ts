const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;

/** Split a hostname into its dot-separated labels, ignoring IPv6 brackets. */
export function getHostnameLabels(hostname: string) {
  return hostname.replace(/^\[|\]$/g, "").split(".").filter(Boolean);
}

/** Detect IPv4 or bracketed IPv6 literals used in place of a named domain. */
export function isIpLiteralHost(hostname: string) {
  if (!hostname) return false;
  if (hostname.startsWith("[") && hostname.endsWith("]")) return true;
  return ipv4Pattern.test(hostname);
}

/**
 * Approximate the registrable domain by taking the final two labels.
 * This is a lightweight approximation, not a public-suffix-list lookup.
 */
export function splitRegistrableDomain(hostname: string): {
  subdomain: string;
  registrableDomain: string;
} {
  const bare = hostname.replace(/^\[|\]$/g, "");
  if (!bare || isIpLiteralHost(hostname)) {
    return { subdomain: "", registrableDomain: bare };
  }

  const labels = bare.split(".").filter(Boolean);
  if (labels.length <= 2) {
    return { subdomain: "", registrableDomain: bare };
  }

  return {
    subdomain: labels.slice(0, -2).join("."),
    registrableDomain: labels.slice(-2).join("."),
  };
}
