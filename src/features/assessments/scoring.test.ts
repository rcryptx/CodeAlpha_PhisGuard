import { lessons } from "@/features/learning/curriculum";

import { assessmentQuestions } from "./questions";
import {
  appendAssessmentAttempt,
  getAssessmentQuestions,
  PASSING_SCORE_PERCENTAGE,
  scoreAssessment,
} from "./scoring";
import type { AssessmentQuestion } from "./types";
import { validateQuestionBank } from "./validateQuestionBank";

describe("assessment question bank", () => {
  it("contains at least two valid questions for every learning topic", () => {
    expect(assessmentQuestions.length).toBeGreaterThanOrEqual(24);
    expect(validateQuestionBank(assessmentQuestions)).toEqual({
      valid: true,
      errors: [],
    });

    const ids = assessmentQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const lesson of lessons) {
      const topicQuestions = assessmentQuestions.filter(
        (question) => question.topicSlug === lesson.slug,
      );
      expect(topicQuestions.length).toBeGreaterThanOrEqual(2);
      for (const question of topicQuestions) {
        expect(question.lessonSlug).toBe(lesson.slug);
        expect(question.options).toHaveLength(4);
        expect(
          question.options.some(
            (option) => option.id === question.correctOptionId,
          ),
        ).toBe(true);
      }
    }
  });

  it("rejects duplicated IDs, malformed options, missing answers and references", () => {
    const malformed: unknown[] = [
      {
        ...assessmentQuestions[0],
        id: assessmentQuestions[0].id,
        topicSlug: "not-a-lesson",
        lessonSlug: "not-a-lesson",
        difficulty: "Expert",
        explanation: "",
        options: [
          { id: "same", text: "One" },
          { id: "same", text: "Two" },
          { id: "three", text: "Three" },
          { id: "four", text: "Four" },
        ],
        correctOptionId: "missing",
      },
      {
        id: assessmentQuestions[0].id,
        topicSlug: lessons[0].slug,
        lessonSlug: lessons[0].slug,
        difficulty: "Beginner",
        prompt: "",
        options: [],
        correctOptionId: "",
        explanation: "",
        learningObjective: "",
      },
    ];

    const validation = validateQuestionBank(malformed);
    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("duplicate ID"),
        expect.stringContaining("invalid topic reference"),
        expect.stringContaining("invalid difficulty"),
        expect.stringContaining("must have an explanation"),
        expect.stringContaining("duplicate option ID"),
        expect.stringContaining("missing correct answer"),
        expect.stringContaining("exactly four answer options"),
      ]),
    );
    expect(validateQuestionBank({})).toEqual({
      valid: false,
      errors: ["Question bank must be an array."],
    });
  });

  it("selects the complete bank or only the requested lesson topic", () => {
    const topicSlug = lessons[3].slug;
    const topicQuestions = getAssessmentQuestions(assessmentQuestions, {
      kind: "topic",
      lessonSlug: topicSlug,
    });
    expect(topicQuestions).toHaveLength(2);
    expect(
      topicQuestions.every((question) => question.topicSlug === topicSlug),
    ).toBe(true);
    expect(
      getAssessmentQuestions(assessmentQuestions, { kind: "full" }),
    ).toHaveLength(assessmentQuestions.length);
  });
});

describe("deterministic assessment scoring", () => {
  const questions = assessmentQuestions.slice(0, 3);
  const allCorrect = Object.fromEntries(
    questions.map((question) => [question.id, question.correctOptionId]),
  );
  const allIncorrect = Object.fromEntries(
    questions.map((question) => [
      question.id,
      question.options.find((option) => option.id !== question.correctOptionId)!
        .id,
    ]),
  );

  it("scores all correct and all incorrect answers against the central threshold", () => {
    const passed = scoreAssessment(
      "full",
      "Full assessment",
      questions,
      allCorrect,
    );
    expect(passed.percentage).toBe(100);
    expect(passed.correctAnswers).toBe(3);
    expect(passed.incorrectAnswers).toBe(0);
    expect(passed.unansweredQuestions).toBe(0);
    expect(passed.passed).toBe(true);
    expect(PASSING_SCORE_PERCENTAGE).toBe(70);

    const failed = scoreAssessment(
      "full",
      "Full assessment",
      questions,
      allIncorrect,
    );
    expect(failed.percentage).toBe(0);
    expect(failed.correctAnswers).toBe(0);
    expect(failed.incorrectAnswers).toBe(3);
    expect(failed.passed).toBe(false);
  });

  it("counts unanswered and invalid option identifiers as not correct", () => {
    const result = scoreAssessment("full", "Full assessment", questions, {
      [questions[0].id]: questions[0].correctOptionId,
      [questions[1].id]: "not-a-valid-option",
      unknownQuestion: questions[2].correctOptionId,
    });

    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(0);
    expect(result.unansweredQuestions).toBe(2);
    expect(result.percentage).toBe(33);
    expect(result.review.map((item) => item.outcome)).toEqual([
      "correct",
      "unanswered",
      "unanswered",
    ]);
  });

  it("does not accept inherited answer identifiers", () => {
    const inheritedAnswers = Object.create({
      [questions[0].id]: questions[0].correctOptionId,
    }) as Record<string, unknown>;
    const result = scoreAssessment(
      "full",
      "Full assessment",
      [questions[0]],
      inheritedAnswers,
    );
    expect(result.correctAnswers).toBe(0);
    expect(result.unansweredQuestions).toBe(1);
  });

  it("rounds mixed percentage and calculates topic and difficulty performance", () => {
    const result = scoreAssessment("full", "Full assessment", questions, {
      [questions[0].id]: questions[0].correctOptionId,
    });

    expect(result.percentage).toBe(33);
    expect(result.topicPerformance[questions[0].topicSlug]).toEqual({
      total: 2,
      correct: 1,
      percentage: 50,
    });
    expect(result.difficultyPerformance.Beginner).toEqual({
      total: 2,
      correct: 1,
      percentage: 50,
    });
    expect(result.difficultyPerformance.Intermediate).toEqual({
      total: 1,
      correct: 0,
      percentage: 0,
    });
  });

  it("defines empty assessments without a fabricated score", () => {
    const result = scoreAssessment("empty", "Empty", [], {});
    expect(result).toMatchObject({
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      unansweredQuestions: 0,
      percentage: null,
      passed: false,
      topicPerformance: {},
      difficultyPerformance: {},
      review: [],
    });
  });

  it("keeps submitted attempt snapshots immutable when a retry is appended", () => {
    const first = scoreAssessment(
      "topic",
      "Topic",
      questions,
      { [questions[0].id]: questions[0].correctOptionId },
      1,
    );
    const second = scoreAssessment("topic", "Topic", questions, allCorrect, 2);
    const history = [first];
    const nextHistory = appendAssessmentAttempt(history, second);

    expect(history).toHaveLength(1);
    expect(history[0]).toBe(first);
    expect(first.attemptNumber).toBe(1);
    expect(first.correctAnswers).toBe(1);
    expect(nextHistory).toEqual([first, second]);
    expect(nextHistory[1].attemptNumber).toBe(2);
  });

  it("applies the passing threshold at its exact boundary", () => {
    const sample: AssessmentQuestion[] = Array.from(
      { length: 10 },
      (_, index) => assessmentQuestions[index],
    );
    const answers = Object.fromEntries(
      sample
        .slice(0, 7)
        .map((question) => [question.id, question.correctOptionId]),
    );
    const result = scoreAssessment("threshold", "Threshold", sample, answers);
    expect(result.percentage).toBe(PASSING_SCORE_PERCENTAGE);
    expect(result.passed).toBe(true);
  });
});
