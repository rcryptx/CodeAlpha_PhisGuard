import type { ParsedUrlInput, UrlFinding } from "./types";

const commonBrands = [
  "amazon",
  "apple",
  "dhl",
  "facebook",
  "fedex",
  "google",
  "instagram",
  "microsoft",
  "netflix",
  "paypal",
  "ups",
];

const commonTopLevelDomains = new Set([
  "com",
  "net",
  "org",
  "co",
  "io",
  "gov",
  "edu",
  "info",
]);

const brandActionPattern =
  /^(?:amazon|apple|dhl|facebook|fedex|google|instagram|microsoft|netflix|paypal|ups)[-_](?:account|auth|login|secure|support|update|verify)$|^(?:account|auth|login|secure|support|update|verify)[-_](?:amazon|apple|dhl|facebook|fedex|google|instagram|microsoft|netflix|paypal|ups)$/;

const redirectParameterPattern =
  /^(?:continue|dest|destination|next|redirect|return|target|url)$/i;
const sensitiveParameterPattern =
  /^(?:access[_-]?token|api[_-]?key|auth|password|passwd|secret|session[_-]?id)$/i;

function finding(
  ruleId: string,
  title: string,
  severity: UrlFinding["severity"],
  explanation: string,
  evidence: string,
  recommendation: string,
): UrlFinding {
  return { ruleId, title, severity, explanation, evidence, recommendation };
}

function isIpAddress(hostname: string) {
  if (hostname.startsWith("[") && hostname.endsWith("]")) return true;
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);
}

function getHostnameLabels(hostname: string) {
  return hostname
    .replace(/^\[|\]$/g, "")
    .split(".")
    .filter(Boolean);
}

function hasMisleadingBrandDomain(hostname: string) {
  const labels = getHostnameLabels(hostname);

  for (let index = 0; index < labels.length - 2; index += 1) {
    const brand = labels[index];
    const followingLabel = labels[index + 1];
    if (
      commonBrands.includes(brand) &&
      commonTopLevelDomains.has(followingLabel) &&
      index + 2 < labels.length
    ) {
      const actualSuffix = labels.slice(index + 2);
      if (!actualSuffix.includes(brand)) return `${brand}.${followingLabel}`;
    }
  }

  return undefined;
}

function findExternalRedirect(
  parsed: ParsedUrlInput,
): { parameter: string; hostname: string } | undefined {
  for (const [parameter, value] of parsed.url.searchParams) {
    if (!redirectParameterPattern.test(parameter)) continue;

    try {
      const destination = new URL(value);
      if (
        (destination.protocol === "http:" ||
          destination.protocol === "https:") &&
        destination.hostname &&
        destination.hostname !== parsed.url.hostname
      ) {
        return { parameter, hostname: destination.hostname };
      }
    } catch {
      continue;
    }
  }

  return undefined;
}

export function detectUrlFindings(parsed: ParsedUrlInput): UrlFinding[] {
  const { url, rawAuthority, rawHostname, raw, pathAndQuery } = parsed;
  const findings: UrlFinding[] = [];
  const hostname = url.hostname.toLowerCase();
  const labels = getHostnameLabels(hostname);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    findings.push(
      finding(
        "unsupported-scheme",
        "Unsupported URL scheme",
        ["javascript:", "data:", "file:", "vbscript:"].includes(url.protocol)
          ? "high"
          : "medium",
        "This inspector only evaluates HTTP and HTTPS URL structure. Other schemes may refer to local files, embedded content, or application actions.",
        `Scheme: ${url.protocol}`,
        "Do not open this address unless you expected this type of link and understand what it will do.",
      ),
    );
    return findings;
  }

  if (url.protocol === "http:") {
    findings.push(
      finding(
        "unencrypted-http",
        "Connection is not encrypted by HTTPS",
        "medium",
        "HTTP does not protect the connection from being read or altered in transit in the way HTTPS is designed to.",
        `Scheme: ${url.protocol}`,
        "For sign-ins or sensitive information, navigate to the service’s known HTTPS address instead.",
      ),
    );
  }

  if (!url.hostname) {
    findings.push(
      finding(
        "missing-hostname",
        "Hostname is missing",
        "high",
        "A web URL needs a hostname to identify the destination site.",
        `Parsed address has no hostname (scheme: ${url.protocol}).`,
        "Check the address and use the website’s known hostname.",
      ),
    );
    return findings;
  }

  if (isIpAddress(hostname)) {
    findings.push(
      finding(
        "ip-address-hostname",
        "Address uses an IP literal",
        "medium",
        "The URL points directly to a numeric IP address instead of using a named domain. This can be legitimate, but is less typical for public services.",
        `Hostname: ${hostname}`,
        "Verify that you expected this exact IP address before continuing.",
      ),
    );
  }

  const rawHasUnicode = rawHostname
    .split("")
    .some((character) => character.charCodeAt(0) > 0x7f);
  if (rawHasUnicode) {
    findings.push(
      finding(
        "unicode-hostname",
        "Hostname contains Unicode characters",
        "medium",
        "Some Unicode letters can resemble characters from other writing systems. The browser converts internationalized hostnames to an ASCII representation.",
        `Entered hostname: ${rawHostname}; parsed hostname: ${hostname}`,
        "Compare the hostname with the organization’s known address rather than relying on how similar the characters look.",
      ),
    );
  }

  if (!rawHasUnicode && labels.some((label) => label.startsWith("xn--"))) {
    findings.push(
      finding(
        "punycode-hostname",
        "Hostname contains a punycode label",
        "medium",
        "Punycode is used to represent internationalized domain labels. Some visually similar characters can be difficult to distinguish from ordinary Latin letters.",
        `Hostname label: ${labels.find((label) => label.startsWith("xn--"))}`,
        "Verify the exact domain through a trusted source before entering information.",
      ),
    );
  }

  const misleadingBrand = hasMisleadingBrandDomain(hostname);
  if (misleadingBrand) {
    findings.push(
      finding(
        "brand-domain-in-subdomain",
        "Brand-like domain text appears before another domain",
        "high",
        "The hostname contains a familiar brand name followed by a domain ending such as .com, but that text appears before the hostname’s trailing labels.",
        `Hostname contains “${misleadingBrand}” before trailing labels “${labels.slice(-2).join(".")}”.`,
        "Read the hostname from right to left and use the brand’s known app or website instead.",
      ),
    );
  }

  const impersonationLabel = labels.find((label) =>
    brandActionPattern.test(label),
  );
  if (impersonationLabel) {
    findings.push(
      finding(
        "brand-action-hostname",
        "Hostname combines a brand-like name with an account action",
        "medium",
        "A hostname label combines a familiar brand name with terms often used in sign-in or account prompts. This pattern alone does not establish who operates the domain.",
        `Hostname label: ${impersonationLabel}`,
        "Confirm the complete domain using a trusted source before signing in.",
      ),
    );
  }

  const subdomainCount = Math.max(0, labels.length - 2);
  if (subdomainCount > 4) {
    findings.push(
      finding(
        "deep-subdomain",
        "Hostname has many subdomain levels",
        "low",
        "Several labels appear before the final two hostname labels. Deep subdomains can be legitimate, but make the actual site domain harder to notice.",
        `${subdomainCount} labels appear before the final two hostname labels.`,
        "Identify the domain near the end of the hostname and verify it independently.",
      ),
    );
  }

  if (url.username || url.password || rawAuthority.includes("@")) {
    findings.push(
      finding(
        "embedded-credentials",
        "URL contains embedded credentials",
        "high",
        "The URL includes user information before the hostname. This structure can obscure which host the browser will contact and may expose credentials in copied URLs.",
        "The authority contains a username or password before @; credential values are not displayed.",
        "Do not use the link. Remove it from messages and navigate to the intended service through a trusted route.",
      ),
    );
  }

  if ((rawAuthority.match(/@/g) ?? []).length > 1) {
    findings.push(
      finding(
        "multiple-at-signs",
        "Authority contains multiple @ characters",
        "medium",
        "Multiple @ characters can make the boundary between user information and hostname difficult to interpret.",
        "More than one literal @ appears in the URL authority.",
        "Do not rely on the displayed text; verify the destination domain independently.",
      ),
    );
  }

  if (url.port) {
    findings.push(
      finding(
        "nonstandard-port",
        "URL uses a non-default port",
        "low",
        "The destination uses a port other than the default port for its scheme. This is common in some applications, but should be expected.",
        `Port: ${url.port}`,
        "Confirm that this service is expected to use this port before entering sensitive information.",
      ),
    );
  }

  if (raw.length > 2048) {
    findings.push(
      finding(
        "long-url",
        "URL is unusually long",
        raw.length > 8192 ? "high" : "medium",
        "The URL is substantially longer than most ordinary links and may be difficult to inspect. Length alone does not indicate malicious behavior.",
        `Length: ${raw.length} characters (review threshold: 2,048).`,
        "Avoid opening an unexpectedly long link. Use a known route to reach the intended service.",
      ),
    );
  }

  const encodedCharacters = pathAndQuery.match(/%[0-9a-f]{2}/gi) ?? [];
  const malformedEncoding = /%(?![0-9a-f]{2})/i.test(pathAndQuery);
  const lowerPathAndQuery = pathAndQuery.toLowerCase();
  const encodedControl = ["%00", "%0a", "%0d"].some((escape) =>
    lowerPathAndQuery.includes(escape),
  );
  const doubleEncodedSeparator = /%25(?:2e|2f|5c|40)/i.test(pathAndQuery);
  if (encodedControl || doubleEncodedSeparator) {
    findings.push(
      finding(
        "encoded-control-or-separator",
        "Path or query contains encoded control or separator characters",
        "medium",
        "Encoded control characters or double-encoded separators can make a URL’s apparent structure differ from how another system interprets it.",
        encodedControl
          ? "Path or query contains an encoded null, line feed, or carriage return."
          : "Path or query contains a double-encoded dot, slash, backslash, or @ separator.",
        "Do not open the link if it was unexpected; verify the intended destination through a trusted route.",
      ),
    );
  } else if (
    encodedCharacters.length >= 8 &&
    encodedCharacters.length / Math.max(1, pathAndQuery.length) >= 0.15
  ) {
    findings.push(
      finding(
        "dense-url-encoding",
        "Path or query is heavily percent-encoded",
        "low",
        "A large share of the path or query uses percent-encoding, which makes the visible address harder to review. Encoding also has many legitimate uses.",
        `${encodedCharacters.length} encoded octets in ${pathAndQuery.length} path/query characters.`,
        "Use a trusted source to confirm the destination instead of trying to interpret an unfamiliar encoded link.",
      ),
    );
  }

  if (malformedEncoding) {
    findings.push(
      finding(
        "malformed-percent-encoding",
        "Path or query contains an incomplete percent escape",
        "low",
        "A percent sign in a URL escape is not followed by two hexadecimal digits. Different systems may handle malformed escapes inconsistently.",
        "An incomplete percent escape appears in the path or query; values are omitted.",
        "If the URL was unexpected, avoid opening it and request a clean link through a trusted channel.",
      ),
    );
  }

  const sensitiveParameter = [...url.searchParams.keys()].find((parameter) =>
    sensitiveParameterPattern.test(parameter),
  );
  if (sensitiveParameter) {
    findings.push(
      finding(
        "sensitive-query-parameter",
        "Query parameter name suggests sensitive data",
        "low",
        "The query contains a parameter name commonly associated with credentials or tokens. Values in URLs may be stored in browser history, logs, or referrer data.",
        `Parameter name: ${sensitiveParameter}; its value is not displayed.`,
        "Avoid sharing this URL. If it contains a live credential or token, use the service’s official process to replace or revoke it.",
      ),
    );
  }

  const externalRedirect = findExternalRedirect(parsed);
  if (externalRedirect) {
    findings.push(
      finding(
        "external-redirect-parameter",
        "Redirect parameter points to a different hostname",
        "low",
        "A redirect-style query parameter contains an absolute HTTP(S) destination on a different hostname. Such parameters can be legitimate, but can also obscure where a user will end up.",
        `Parameter “${externalRedirect.parameter}” names hostname “${externalRedirect.hostname}”, different from “${hostname}”.`,
        "Check the final destination and avoid signing in after an unexpected redirect.",
      ),
    );
  }

  return findings;
}
