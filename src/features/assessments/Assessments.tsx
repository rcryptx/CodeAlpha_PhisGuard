import { useState } from "react";

import { assessmentQuestions } from "./questions";
import { AssessmentHome } from "./AssessmentHome";
import { AssessmentResults } from "./AssessmentResults";
import { AssessmentSession } from "./AssessmentSession";
import { appendAssessmentAttempt, getAssessmentQuestions } from "./scoring";
import { validateQuestionBank } from "./validateQuestionBank";
import type { AssessmentMode, AssessmentResult } from "./types";

const questionBankValidation = validateQuestionBank(assessmentQuestions);
if (!questionBankValidation.valid) {
  throw new Error(
    `Invalid assessment question bank: ${questionBankValidation.errors.join(" ")}`,
  );
}

type View = "home" | "session" | "results";

export function Assessments() {
  const [view, setView] = useState<View>("home");
  const [mode, setMode] = useState<AssessmentMode | null>(null);
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(
    null,
  );
  const [attemptHistory, setAttemptHistory] = useState<AssessmentResult[]>([]);

  const questions = mode
    ? getAssessmentQuestions(
        assessmentQuestions,
        mode.kind === "full"
          ? { kind: "full" }
          : { kind: "topic", lessonSlug: mode.lessonSlug },
      )
    : [];
  const attemptNumber = mode
    ? attemptHistory.filter((result) => result.assessmentId === mode.id)
        .length + 1
    : 1;

  function startAssessment(nextMode: AssessmentMode) {
    setMode(nextMode);
    setCurrentResult(null);
    setView("session");
  }

  function completeAssessment(result: AssessmentResult) {
    setAttemptHistory((history) => appendAssessmentAttempt(history, result));
    setCurrentResult(result);
    setView("results");
  }

  function returnHome() {
    setView("home");
    setMode(null);
    setCurrentResult(null);
  }

  if (view === "session" && mode) {
    return (
      <AssessmentSession
        key={`${mode.id}-${attemptNumber}`}
        mode={mode}
        questions={questions}
        attemptNumber={attemptNumber}
        onComplete={completeAssessment}
        onCancel={returnHome}
      />
    );
  }

  if (view === "results" && currentResult && mode) {
    const previousAttempts =
      attemptHistory.filter(
        (result) => result.assessmentId === currentResult.assessmentId,
      ).length - 1;
    return (
      <AssessmentResults
        result={currentResult}
        previousAttempts={previousAttempts}
        onRetry={() => startAssessment(mode)}
        onReturn={returnHome}
      />
    );
  }

  return <AssessmentHome onStart={startAssessment} />;
}
