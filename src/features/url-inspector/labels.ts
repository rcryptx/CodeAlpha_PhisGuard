import type { FindingSeverity, RiskCategory } from "./types";

export const riskLabels: Record<RiskCategory, string> = {
  "invalid-url": "Invalid URL",
  "high-concern": "High concern",
  suspicious: "Suspicious",
  "low-concern": "Low concern",
  "no-obvious-indicators": "No obvious structural indicators detected",
};

export const riskDescriptions: Record<RiskCategory, string> = {
  "invalid-url": "This input could not be analyzed as a valid absolute URL.",
  "high-concern": "One or more high-severity structural indicators were found.",
  suspicious: "One or more medium-severity structural indicators were found.",
  "low-concern": "Only low-severity structural indicators were found.",
  "no-obvious-indicators":
    "No indicators from the current set of local structural rules were found.",
};

export const severityLabels: Record<FindingSeverity, string> = {
  high: "High severity",
  medium: "Medium severity",
  low: "Low severity",
};

export const severityRank: FindingSeverity[] = ["high", "medium", "low"];
