import { buildUrlAnatomy } from "./anatomy";
import { classifyRisk } from "./classifyRisk";
import { parseUrlInput, sanitizeUrlForDisplay } from "./parseUrl";
import { detectUrlFindings } from "./rules";
import type { UrlAnalysisResult } from "./types";

export const urlSafetyDisclaimer =
  "No obvious indicators detected does not guarantee that a URL is safe. This analysis does not visit the website or check its live reputation.";

export function analyzeUrl(input: string): UrlAnalysisResult {
  const parsedResult = parseUrlInput(input);

  if (!parsedResult.success) {
    return {
      normalizedUrl: input.trim(),
      hostname: "",
      protocol: parsedResult.protocol ? `${parsedResult.protocol}:` : "",
      risk: "invalid-url",
      findings: [],
      anatomy: null,
      error: parsedResult.error,
    };
  }

  const { parsed } = parsedResult;
  const findings = detectUrlFindings(parsed);
  return {
    normalizedUrl: sanitizeUrlForDisplay(parsed.url),
    hostname: parsed.url.hostname,
    protocol: parsed.url.protocol,
    risk: classifyRisk(findings),
    findings,
    anatomy: buildUrlAnatomy(parsed),
  };
}
