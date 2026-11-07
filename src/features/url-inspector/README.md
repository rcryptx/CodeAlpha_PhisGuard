# URL Inspector

The URL Inspector evaluates URL text with native URL parsing and deterministic browser-local rules. It does not navigate to, fetch, preview, or execute the submitted address and does not send it to a service.

## Checks

The current rules cover HTTP versus HTTPS, unsupported schemes, IP-literal hosts, punycode and Unicode hostnames, brand-shaped hostname patterns, deep subdomains, embedded credentials and multiple `@` characters, non-default ports, long URLs, unusual or malformed percent encoding, sensitive-looking query parameter names, and external redirect parameters.

Evidence avoids credential and query values. The displayed address omits path and query values so they are not unnecessarily repeated in results.

## Risk classification

- **Invalid URL:** parsing or required URL structure validation failed.
- **High concern:** at least one high-severity finding exists.
- **Suspicious:** no high finding exists, but at least one medium finding exists.
- **Low concern:** only low-severity findings exist.
- **No obvious structural indicators detected:** no current rule matched.

These are deterministic labels, not probabilities. Rule severities communicate review priority and are not a verdict about the website.

## Limitations and false positives

The inspector evaluates visible URL structure only. It does not check page content, DNS, certificates, redirects performed by a server, malware, or live reputation. A URL without findings may still be unsafe. Legitimate services can use IP addresses, internationalized domains, non-default ports, long links, or redirect parameters; review each finding in context.

Hostname heuristics use a small built-in set of familiar brand names and a simple hostname-label approximation, not a public-suffix database. They may miss newly registered or unfamiliar impersonation domains and can flag legitimate custom domains.

## Adding rules

Keep parsing and detection local to this feature. Add a stable rule ID, severity, concise explanation, evidence derived only from parsed input, and a practical recommendation in `rules.ts`. Update `analyzeUrl.test.ts` with positive and false-positive-sensitive cases. Never fetch, open, or transmit the submitted URL from a rule.
