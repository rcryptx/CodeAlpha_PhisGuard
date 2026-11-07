import { useState, type FormEvent } from "react";

import { FeedbackPanel } from "./FeedbackPanel";
import {
  calculateSessionSummary,
  evaluateDecision,
  isSessionComplete,
} from "./scenarioEngine";
import { practiceScenarios } from "./scenarios";
import { SessionSummary } from "./SessionSummary";
import type {
  DecisionEvaluation,
  PracticeAttempt,
  PracticeScenario,
} from "./types";

function ScenarioSelector({
  attempts,
  onSelect,
  onShowSummary,
  onRestart,
}: {
  attempts: PracticeAttempt[];
  onSelect: (scenario: PracticeScenario) => void;
  onShowSummary: () => void;
  onRestart: () => void;
}) {
  const attemptedIds = new Set(attempts.map((attempt) => attempt.scenarioId));
  const complete = isSessionComplete(attempts);
  const scenariosAttempted = attemptedIds.size;

  return (
    <section aria-labelledby="scenario-selection-heading">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <h2
            id="scenario-selection-heading"
            className="text-xl font-semibold tracking-tight text-slate-950"
          >
            Choose a scenario
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Play each scenario to unlock a summary. You can revisit scenarios
            and make new decisions; every submitted decision counts as a
            separate session attempt.
          </p>
        </div>
        <p className="shrink-0 text-sm font-medium text-slate-700">
          {scenariosAttempted} of {practiceScenarios.length} scenarios tried
          <span className="sr-only">
            ; {attempts.length} decisions submitted in this session
          </span>
        </p>
      </div>

      <ol className="mt-2 divide-y divide-slate-200">
        {practiceScenarios.map((scenario, index) => {
          const scenarioAttempts = attempts.filter(
            (attempt) => attempt.scenarioId === scenario.id,
          ).length;

          return (
            <li
              key={scenario.id}
              className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Scenario {index + 1} · {scenario.category} ·{" "}
                  {scenario.difficulty}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900">
                  {scenario.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {scenarioAttempts > 0
                    ? `Played ${scenarioAttempts} ${scenarioAttempts === 1 ? "time" : "times"}`
                    : "Not played"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelect(scenario)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              >
                {scenarioAttempts > 0 ? "Practice again" : "Start scenario"}
                <span className="sr-only">: {scenario.title}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-5">
        {complete && (
          <button
            type="button"
            onClick={onShowSummary}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            View session summary
          </button>
        )}
        {attempts.length > 0 && (
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Restart session
          </button>
        )}
      </div>
    </section>
  );
}

function ScenarioView({
  scenario,
  scenarioNumber,
  attempts,
  selectedDecisionId,
  evaluation,
  onSelectDecision,
  onSubmit,
  onNext,
  onReplay,
  onBack,
  canShowSummary,
  onShowSummary,
}: {
  scenario: PracticeScenario;
  scenarioNumber: number;
  attempts: PracticeAttempt[];
  selectedDecisionId: string | null;
  evaluation: DecisionEvaluation | null;
  onSelectDecision: (decisionId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNext: () => void;
  onReplay: () => void;
  onBack: () => void;
  canShowSummary: boolean;
  onShowSummary: () => void;
}) {
  return (
    <section aria-labelledby="scenario-heading">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex min-h-10 items-center text-sm font-medium text-slate-700 underline decoration-slate-400 underline-offset-4 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ← All scenarios
      </button>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Scenario {scenarioNumber} of {practiceScenarios.length} ·{" "}
            {scenario.category}
          </p>
          <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700">
            {scenario.difficulty}
          </span>
        </div>

        <h2
          id="scenario-heading"
          className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
        >
          {scenario.title}
        </h2>
        <dl className="mt-5 grid gap-3 border-y border-slate-200 py-4 text-sm sm:grid-cols-[6rem_1fr]">
          <dt className="font-medium text-slate-600">From</dt>
          <dd className="text-slate-800">{scenario.sender}</dd>
          <dt className="font-medium text-slate-600">Channel</dt>
          <dd className="text-slate-800">{scenario.channel}</dd>
        </dl>

        <article className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Simulated message · not sent to or from a real person
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-800">
            {scenario.scenarioText}
          </p>
        </article>

        <form className="mt-7" onSubmit={onSubmit}>
          <fieldset disabled={evaluation !== null}>
            <legend className="font-semibold text-slate-900">
              What would you do?
            </legend>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Choose the response you would take, then submit it to see the
              explanation.
            </p>
            <div className="mt-4 space-y-3">
              {scenario.decisions.map((decision) => (
                <label
                  key={decision.id}
                  className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-800 transition hover:border-slate-400 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-slate-700 has-[:checked]:border-slate-500 has-[:checked]:bg-slate-50"
                >
                  <input
                    type="radio"
                    name={`decision-${scenario.id}`}
                    value={decision.id}
                    checked={selectedDecisionId === decision.id}
                    onChange={() => onSelectDecision(decision.id)}
                    className="mt-1 size-4 shrink-0 accent-slate-800"
                  />
                  <span>{decision.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {!evaluation && (
            <button
              type="submit"
              disabled={!selectedDecisionId}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500"
            >
              Submit decision
            </button>
          )}
        </form>

        {evaluation && (
          <>
            <FeedbackPanel evaluation={evaluation} scenario={scenario} />
            <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={onNext}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              >
                Next scenario
              </button>
              <button
                type="button"
                onClick={onReplay}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              >
                Replay scenario
              </button>
              {canShowSummary && (
                <button
                  type="button"
                  onClick={onShowSummary}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                >
                  View session summary
                </button>
              )}
            </div>
            <p className="sr-only" role="status">
              {attempts.length}{" "}
              {attempts.length === 1 ? "decision" : "decisions"} submitted in
              this session.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export function PracticeLab() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(
    null,
  );
  const [evaluation, setEvaluation] = useState<DecisionEvaluation | null>(null);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const activeScenario = practiceScenarios.find(
    (scenario) => scenario.id === activeScenarioId,
  );
  const complete = isSessionComplete(attempts);

  function startScenario(scenario: PracticeScenario) {
    setActiveScenarioId(scenario.id);
    setSelectedDecisionId(null);
    setEvaluation(null);
    setShowSummary(false);
  }

  function submitDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeScenario || !selectedDecisionId || evaluation) return;

    const result = evaluateDecision(activeScenario, selectedDecisionId);
    if (!result) return;

    setEvaluation(result);
    setAttempts((current) => [
      ...current,
      {
        scenarioId: activeScenario.id,
        decisionId: result.decision.id,
        isCorrect: result.isCorrect,
      },
    ]);
  }

  function goToNextScenario() {
    if (!activeScenario) return;
    const currentIndex = practiceScenarios.findIndex(
      (scenario) => scenario.id === activeScenario.id,
    );
    const nextScenario =
      practiceScenarios[(currentIndex + 1) % practiceScenarios.length];
    if (nextScenario) startScenario(nextScenario);
  }

  function restartSession() {
    setActiveScenarioId(null);
    setSelectedDecisionId(null);
    setEvaluation(null);
    setAttempts([]);
    setShowSummary(false);
  }

  function showSessionSummary() {
    if (isSessionComplete(attempts)) {
      setActiveScenarioId(null);
      setShowSummary(true);
    }
  }

  const attemptedCount = calculateSessionSummary(attempts).scenariosAttempted;
  const activeScenarioNumber = activeScenario
    ? practiceScenarios.findIndex(
        (scenario) => scenario.id === activeScenario.id,
      ) + 1
    : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 border-b border-slate-200 pb-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Learn by making the call
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Practice Lab
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Work through simulated messages and everyday situations. Choose what
          you would do, then learn from clear feedback about the signals and a
          safer response.
        </p>
        <p className="mt-4 border-l-2 border-slate-300 pl-4 text-sm leading-6 text-slate-600">
          Every scenario is fictional and for learning only. No messages are
          sent, links are not opened, and no credentials or personal information
          are collected. Do not use scenarios to test real people.
        </p>
      </header>

      {showSummary ? (
        <SessionSummary
          attempts={attempts}
          onRestart={restartSession}
          onReview={() => setShowSummary(false)}
        />
      ) : activeScenario ? (
        <ScenarioView
          scenario={activeScenario}
          scenarioNumber={activeScenarioNumber}
          attempts={attempts}
          selectedDecisionId={selectedDecisionId}
          evaluation={evaluation}
          onSelectDecision={setSelectedDecisionId}
          onSubmit={submitDecision}
          onNext={goToNextScenario}
          onReplay={() => {
            setSelectedDecisionId(null);
            setEvaluation(null);
          }}
          onBack={() => {
            setActiveScenarioId(null);
            setSelectedDecisionId(null);
            setEvaluation(null);
          }}
          canShowSummary={complete}
          onShowSummary={showSessionSummary}
        />
      ) : (
        <ScenarioSelector
          attempts={attempts}
          onSelect={startScenario}
          onShowSummary={showSessionSummary}
          onRestart={restartSession}
        />
      )}

      <p className="mt-7 text-xs leading-5 text-slate-500">
        Session only · {attemptedCount} of {practiceScenarios.length} distinct
        scenarios attempted · decisions are not saved after leaving this page.
      </p>
    </div>
  );
}
