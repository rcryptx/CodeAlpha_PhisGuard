import { lessons } from "@/features/learning/curriculum";

import {
  calculateSessionSummary,
  evaluateDecision,
  isSessionComplete,
} from "./scenarioEngine";
import { practiceScenarios } from "./scenarios";
import type { PracticeAttempt } from "./types";

describe("practice scenario data", () => {
  it("contains eight complete scenarios with unique IDs and valid decisions", () => {
    expect(practiceScenarios).toHaveLength(8);
    expect(new Set(practiceScenarios.map((scenario) => scenario.id)).size).toBe(
      practiceScenarios.length,
    );

    const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
    for (const scenario of practiceScenarios) {
      expect(scenario.title).toBeTruthy();
      expect(scenario.category).toBeTruthy();
      expect(["Beginner", "Intermediate"]).toContain(scenario.difficulty);
      expect(scenario.sender).toBeTruthy();
      expect(scenario.channel).toBeTruthy();
      expect(scenario.scenarioText.length).toBeGreaterThan(80);
      expect(scenario.decisions.length).toBeGreaterThanOrEqual(2);
      expect(
        new Set(scenario.decisions.map((decision) => decision.id)).size,
      ).toBe(scenario.decisions.length);
      expect(
        scenario.decisions.some(
          (decision) => decision.id === scenario.correctDecisionId,
        ),
      ).toBe(true);
      expect(scenario.explanation.length).toBeGreaterThan(50);
      expect(scenario.warningSigns.length).toBeGreaterThan(0);
      expect(scenario.possibleConsequence).toBeTruthy();
      expect(scenario.recommendedResponse).toBeTruthy();
      expect(scenario.takeaway).toBeTruthy();
      expect(lessonSlugs.has(scenario.lessonSlug)).toBe(true);
      expect(scenario.scenarioText).not.toMatch(/https?:\/\//i);
    }

    expect(
      new Set(practiceScenarios.map((scenario) => scenario.category)).size,
    ).toBe(8);
  });
});

describe("practice scenario engine", () => {
  const scenario = practiceScenarios[0];

  it("evaluates correct, incorrect, and unknown decisions deterministically", () => {
    expect(
      evaluateDecision(scenario, scenario.correctDecisionId)?.isCorrect,
    ).toBe(true);

    const incorrectDecision = scenario.decisions.find(
      (decision) => decision.id !== scenario.correctDecisionId,
    );
    expect(incorrectDecision).toBeDefined();
    expect(evaluateDecision(scenario, incorrectDecision!.id)?.isCorrect).toBe(
      false,
    );
    expect(evaluateDecision(scenario, "not-a-decision")).toBeUndefined();
  });

  it("does not allow a session summary until every scenario has been attempted", () => {
    expect(isSessionComplete([])).toBe(false);
    expect(
      isSessionComplete([
        {
          scenarioId: practiceScenarios[0].id,
          decisionId: practiceScenarios[0].correctDecisionId,
          isCorrect: true,
        },
      ]),
    ).toBe(false);

    const attempts: PracticeAttempt[] = practiceScenarios.map((item) => ({
      scenarioId: item.id,
      decisionId: item.correctDecisionId,
      isCorrect: true,
    }));
    expect(isSessionComplete(attempts)).toBe(true);
  });

  it("calculates an empty session without inventing accuracy or topics", () => {
    expect(calculateSessionSummary([])).toEqual({
      scenariosAttempted: 0,
      decisionsMade: 0,
      correctDecisions: 0,
      incorrectDecisions: 0,
      accuracyPercentage: null,
      topicsToPractice: [],
    });
  });

  it("calculates session results from actual attempts and suggests missed topics", () => {
    const firstScenario = practiceScenarios[0];
    const secondScenario = practiceScenarios[1];
    const attempts: PracticeAttempt[] = [
      {
        scenarioId: firstScenario.id,
        decisionId: firstScenario.correctDecisionId,
        isCorrect: false,
      },
      {
        scenarioId: firstScenario.id,
        decisionId: firstScenario.correctDecisionId,
        isCorrect: true,
      },
      {
        scenarioId: secondScenario.id,
        decisionId: secondScenario.correctDecisionId,
        isCorrect: true,
      },
    ];

    expect(calculateSessionSummary(attempts)).toEqual({
      scenariosAttempted: 2,
      decisionsMade: 3,
      correctDecisions: 2,
      incorrectDecisions: 1,
      accuracyPercentage: 67,
      topicsToPractice: [
        {
          category: firstScenario.category,
          recommendation: firstScenario.takeaway,
          lessonSlug: firstScenario.lessonSlug,
        },
      ],
    });
  });
});
