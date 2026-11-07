export type AssessmentDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface AnswerOption {
  id: string;
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  topicSlug: string;
  difficulty: AssessmentDifficulty;
  prompt: string;
  options: AnswerOption[];
  correctOptionId: string;
  explanation: string;
  learningObjective: string;
  lessonSlug: string;
  scenarioContext?: string;
}

export type AssessmentMode =
  | { kind: "full"; id: "full"; title: string }
  | { kind: "topic"; id: string; title: string; lessonSlug: string };

export type AnswerMap = Record<string, string>;

export type QuestionOutcome = "correct" | "incorrect" | "unanswered";

export interface QuestionReview {
  question: AssessmentQuestion;
  selectedOptionId?: string;
  outcome: QuestionOutcome;
}

export interface PerformanceCount {
  total: number;
  correct: number;
  percentage: number | null;
}

export interface AssessmentResult {
  assessmentId: string;
  assessmentTitle: string;
  attemptNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  percentage: number | null;
  passed: boolean;
  topicPerformance: Record<string, PerformanceCount>;
  difficultyPerformance: Record<string, PerformanceCount>;
  review: QuestionReview[];
}
