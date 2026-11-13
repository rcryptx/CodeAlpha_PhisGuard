import { urlSafetyDisclaimer } from "./analyzeUrl";
import { riskLabels, severityLabels } from "./labels";
import type { UrlAnalysisResult } from "./types";

const analysisLimitations = [
  "This report describes URL structure only. It does not visit, fetch, or execute the address, and it does not check DNS, certificates, server-side redirects, page content, or live reputation.",
  "The registrable domain is approximated from the final two hostname labels rather than a public-suffix-list lookup, so it can be wrong for multi-part suffixes such as co.uk.",
  "A missing finding does not mean a URL is safe, and a finding does not mean a URL is malicious. Judge each observation in its real context.",
  "User information and query parameter values are omitted from this report to avoid exposing credentials or tokens.",
];

/**
 * Render a plain-text analysis report that can be copied or downloaded.
 * Pure and UI-independent so the same output can be reused outside the web app.
 */
export function buildUrlReport(result: UrlAnalysisResult): string {
  const lines: string[] = [];

  lines.push("PhisGuard - URL analysis report");
  lines.push("Generated locally in the browser. No network requests were made.");
  lines.push("");
  lines.push(
    result.anatomy
      ? `Address (shareable form): ${result.normalizedUrl}`
      : "Address: not shown (input could not be parsed)",
  );
  lines.push(`Structural risk label: ${riskLabels[result.risk]}`);

  if (result.anatomy) {
    const anatomy = result.anatomy;
    lines.push("");
    lines.push("URL anatomy");
    lines.push(`  Protocol: ${anatomy.protocol}`);
    lines.push(`  Subdomain: ${anatomy.subdomain || "(none)"}`);
    lines.push(`  Hostname: ${anatomy.hostname || "(none)"}`);
    lines.push(
      `  Registrable domain (approximate): ${anatomy.registrableDomain || "(none)"}`,
    );
    lines.push(`  Port: ${anatomy.port || "(default)"}`);
    lines.push(`  Path: ${anatomy.path || "/"}`);
    lines.push(
      `  Query parameters: ${
        anatomy.queryParameterNames.length > 0
          ? anatomy.queryParameterNames.join(", ")
          : "(none)"
      }`,
    );
    lines.push(`  Fragment: ${anatomy.hasFragment ? "(present)" : "(none)"}`);
    lines.push(`  Percent-encoded octets: ${anatomy.percentEncodedOctets}`);
  }

  lines.push("");
  if (result.error) {
    lines.push("Result: input could not be analyzed");
    lines.push(`  ${result.error}`);
  } else if (result.findings.length === 0) {
    lines.push("Findings: none matched the current local rules.");
  } else {
    lines.push(`Findings (${result.findings.length}):`);
    result.findings.forEach((finding, index) => {
      lines.push("");
      lines.push(
        `${index + 1}. [${severityLabels[finding.severity]}] ${finding.title}`,
      );
      lines.push(`   Explanation: ${finding.explanation}`);
      lines.push(`   Evidence: ${finding.evidence}`);
      lines.push(`   Limitation: ${finding.limitation}`);
      lines.push(`   Recommendation: ${finding.recommendation}`);
    });
  }

  lines.push("");
  lines.push("Limitations of this analysis:");
  analysisLimitations.forEach((limitation) => {
    lines.push(`  - ${limitation}`);
  });
  lines.push("");
  lines.push(urlSafetyDisclaimer);

  return lines.join("\n");
}
