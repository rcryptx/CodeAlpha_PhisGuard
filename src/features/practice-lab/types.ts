export type ScenarioCategory =
  | "Email phishing"
  | "Smishing"
  | "Malicious attachments"
  | "Impersonation"
  | "Fake opportunities"
  | "MFA fatigue"
  | "Tech support scams"
  | "QR-code links";

export type ScenarioDifficulty = "Beginner" | "Intermediate";

export interface ScenarioDecision {
  id: string;
  label: string;
}

export interface PracticeScenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  difficulty: ScenarioDifficulty;
  sender: string;
  channel: string;
  scenarioText: string;
  decisions: ScenarioDecision[];
  correctDecisionId: string;
  technique: string;
  explanation: string;
  warningSigns: string[];
  possibleConsequence: string;
  recommendedResponse: string;
  takeaway: string;
  lessonSlug: string;
}

export interface PracticeAttempt {
  scenarioId: string;
  decisionId: string;
  isCorrect: boolean;
}

export interface DecisionEvaluation {
  decision: ScenarioDecision;
  isCorrect: boolean;
}

export interface PracticeTopicRecommendation {
  category: ScenarioCategory;
  recommendation: string;
  lessonSlug: string;
}

export interface PracticeSessionSummary {
  scenariosAttempted: number;
  decisionsMade: number;
  correctDecisions: number;
  incorrectDecisions: number;
  accuracyPercentage: number | null;
  topicsToPractice: PracticeTopicRecommendation[];
}
