import type { RiskCategory, UrlFinding } from "./types";

export function classifyRisk(findings: UrlFinding[]): RiskCategory {
  if (findings.some((finding) => finding.severity === "high")) {
    return "high-concern";
  }
  if (findings.some((finding) => finding.severity === "medium")) {
    return "suspicious";
  }
  if (findings.some((finding) => finding.severity === "low")) {
    return "low-concern";
  }
  return "no-obvious-indicators";
}
