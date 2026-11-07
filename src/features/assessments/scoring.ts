import { lessonBySlug } from "@/features/learning/curriculum";

import type {
  AssessmentQuestion,
  AssessmentResult,
  PerformanceCount,
  QuestionReview,
} from "./types";

export const PASSING_SCORE_PERCENTAGE = 70;

function percentage(correct: number, total: number) {
  return total === 0 ? null : Math.round((correct / total) * 100);
}

function isAnswerRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function groupedPerformance(
  groups: Map<string, { total: number; correct: number }>,
): Record<string, PerformanceCount> {
  return Object.fromEntries(
    [...groups].map(([key, count]) => [
      key,
      {
        total: count.total,
        correct: count.correct,
        percentage: percentage(count.correct, count.total),
      },
    ]),
  );
}

export function scoreAssessment(
  assessmentId: string,
  assessmentTitle: string,
  questions: AssessmentQuestion[],
  submittedAnswers: unknown,
  attemptNumber = 1,
): AssessmentResult {
  const answers = isAnswerRecord(submittedAnswers) ? submittedAnswers : {};
  const topicGroups = new Map<string, { total: number; correct: number }>();
  const difficultyGroups = new Map<
    string,
    { total: number; correct: number }
  >();
  const review: QuestionReview[] = questions.map((question) => {
    const optionIds = new Set(question.options.map((option) => option.id));
    const rawAnswer = Object.hasOwn(answers, question.id)
      ? answers[question.id]
      : undefined;
    const selectedOptionId =
      typeof rawAnswer === "string" && optionIds.has(rawAnswer)
        ? rawAnswer
        : undefined;
    const outcome = !selectedOptionId
      ? "unanswered"
      : selectedOptionId === question.correctOptionId
        ? "correct"
        : "incorrect";
    const topic = lessonBySlug(question.topicSlug)?.slug ?? question.topicSlug;

    for (const [groups, key] of [
      [topicGroups, topic],
      [difficultyGroups, question.difficulty],
    ] as const) {
      const current = groups.get(key) ?? { total: 0, correct: 0 };
      current.total += 1;
      if (outcome === "correct") current.correct += 1;
      groups.set(key, current);
    }

    return { question, selectedOptionId, outcome };
  });

  const correctAnswers = review.filter(
    (item) => item.outcome === "correct",
  ).length;
  const incorrectAnswers = review.filter(
    (item) => item.outcome === "incorrect",
  ).length;
  const unansweredQuestions = review.filter(
    (item) => item.outcome === "unanswered",
  ).length;
  const totalQuestions = questions.length;
  const score = percentage(correctAnswers, totalQuestions);

  return {
    assessmentId,
    assessmentTitle,
    attemptNumber:
      Number.isFinite(attemptNumber) && attemptNumber > 0
        ? Math.floor(attemptNumber)
        : 1,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    percentage: score,
    passed: score !== null && score >= PASSING_SCORE_PERCENTAGE,
    topicPerformance: groupedPerformance(topicGroups),
    difficultyPerformance: groupedPerformance(difficultyGroups),
    review,
  };
}

export function appendAssessmentAttempt(
  history: AssessmentResult[],
  result: AssessmentResult,
) {
  return [...history, result];
}

export function getAssessmentQuestions(
  questions: AssessmentQuestion[],
  mode: { kind: "full" } | { kind: "topic"; lessonSlug: string },
) {
  if (mode.kind === "full") return [...questions];
  return questions.filter((question) => question.topicSlug === mode.lessonSlug);
}
