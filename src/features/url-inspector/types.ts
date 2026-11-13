export type FindingSeverity = "high" | "medium" | "low";

export type RiskCategory =
  | "invalid-url"
  | "high-concern"
  | "suspicious"
  | "low-concern"
  | "no-obvious-indicators";

export interface UrlFinding {
  ruleId: string;
  title: string;
  severity: FindingSeverity;
  explanation: string;
  evidence: string;
  recommendation: string;
  /** What this structural observation cannot tell us. */
  limitation: string;
}

/**
 * A parsed, non-judgemental breakdown of an absolute URL's structure.
 * Kept free of UI concerns so it can be reused outside the web app.
 */
export interface UrlAnatomy {
  /** Scheme including the trailing colon, e.g. "https:". */
  protocol: string;
  /** Whether the URL carried an authority ("//host") component. */
  hasAuthority: boolean;
  /** Whether user information (username/password or an empty @) is present. */
  userinfoPresent: boolean;
  /** Normalized hostname, lowercased by the URL parser. */
  hostname: string;
  /** Labels before the two trailing hostname labels (approximation). */
  subdomain: string;
  /** Final two hostname labels, used as an approximate registrable domain. */
  registrableDomain: string;
  /** Explicit port, or "" when the default/absent. */
  port: string;
  /** Whether the host is an IPv4/IPv6 literal rather than a named domain. */
  isIpHost: boolean;
  /** Whether any hostname label is punycode ("xn--"). */
  isPunycode: boolean;
  /** Whether the text the user entered contained non-ASCII hostname characters. */
  hasUnicodeInput: boolean;
  /** Path component, e.g. "/about". */
  path: string;
  /** Whether a query string is present. */
  hasQuery: boolean;
  /** Query parameter names only; values are never exposed. */
  queryParameterNames: string[];
  /** Whether a fragment is present. */
  hasFragment: boolean;
  /** Number of well-formed percent-encoded octets in the path and query. */
  percentEncodedOctets: number;
  /** Length of the submitted text in characters. */
  characterLength: number;
}

export interface UrlAnalysisResult {
  normalizedUrl: string;
  hostname: string;
  protocol: string;
  risk: RiskCategory;
  findings: UrlFinding[];
  /** Structural breakdown, or null when the input could not be parsed. */
  anatomy: UrlAnatomy | null;
  error?: string;
}

export interface ParsedUrlInput {
  raw: string;
  url: URL;
  rawAuthority: string;
  rawHostname: string;
  pathAndQuery: string;
}
