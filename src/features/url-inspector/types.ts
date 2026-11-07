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
}

export interface UrlAnalysisResult {
  normalizedUrl: string;
  hostname: string;
  protocol: string;
  risk: RiskCategory;
  findings: UrlFinding[];
  error?: string;
}

export interface ParsedUrlInput {
  raw: string;
  url: URL;
  rawAuthority: string;
  rawHostname: string;
  pathAndQuery: string;
}
