import { practiceScenarios } from "./scenarios";
import type {
  DecisionEvaluation,
  PracticeAttempt,
  PracticeScenario,
  PracticeSessionSummary,
  PracticeTopicRecommendation,
} from "./types";

export function evaluateDecision(
  scenario: PracticeScenario,
  decisionId: string,
): DecisionEvaluation | undefined {
  const decision = scenario.decisions.find((item) => item.id === decisionId);
  if (!decision) return undefined;

  return {
    decision,
    isCorrect: decision.id === scenario.correctDecisionId,
  };
}

export function isSessionComplete(
  attempts: PracticeAttempt[],
  scenarios: PracticeScenario[] = practiceScenarios,
) {
  const attemptedIds = new Set(attempts.map((attempt) => attempt.scenarioId));
  return (
    scenarios.length > 0 &&
    scenarios.every((scenario) => attemptedIds.has(scenario.id))
  );
}

export function calculateSessionSummary(
  attempts: PracticeAttempt[],
  scenarios: PracticeScenario[] = practiceScenarios,
): PracticeSessionSummary {
  const scenarioById = new Map(
    scenarios.map((scenario) => [scenario.id, scenario]),
  );
  const topics = new Map<string, PracticeTopicRecommendation>();

  for (const attempt of attempts) {
    if (attempt.isCorrect) continue;
    const scenario = scenarioById.get(attempt.scenarioId);
    if (!scenario || topics.has(scenario.category)) continue;
    topics.set(scenario.category, {
      category: scenario.category,
      recommendation: scenario.takeaway,
      lessonSlug: scenario.lessonSlug,
    });
  }

  const correctDecisions = attempts.filter(
    (attempt) => attempt.isCorrect,
  ).length;
  const decisionsMade = attempts.length;

  return {
    scenariosAttempted: new Set(attempts.map((attempt) => attempt.scenarioId))
      .size,
    decisionsMade,
    correctDecisions,
    incorrectDecisions: decisionsMade - correctDecisions,
    accuracyPercentage:
      decisionsMade === 0
        ? null
        : Math.round((correctDecisions / decisionsMade) * 100),
    topicsToPractice: [...topics.values()],
  };
}
