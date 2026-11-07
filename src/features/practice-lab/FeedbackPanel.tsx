import type { DecisionEvaluation, PracticeScenario } from "./types";

export function FeedbackPanel({
  evaluation,
  scenario,
}: {
  evaluation: DecisionEvaluation;
  scenario: PracticeScenario;
}) {
  return (
    <section
      aria-labelledby="feedback-heading"
      aria-live="polite"
      className="mt-7 border-t border-slate-200 pt-6"
    >
      <h3
        id="feedback-heading"
        className="text-xl font-semibold tracking-tight text-slate-950"
      >
        {evaluation.isCorrect ? "That was a safer choice" : "Take another look"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {evaluation.isCorrect
          ? `You chose: ${evaluation.decision.label}`
          : `You chose: ${evaluation.decision.label} This choice could increase risk.`}
      </p>
      <dl className="mt-5 grid gap-5">
        <div>
          <dt className="text-sm font-semibold text-slate-900">
            What is happening
          </dt>
          <dd className="mt-1 text-sm leading-6 text-slate-700">
            {scenario.explanation} The technique is{" "}
            {scenario.technique.toLowerCase()}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-slate-900">
            Warning signs to notice
          </dt>
          <dd>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {scenario.warningSigns.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-slate-900">
            If the risky action were taken
          </dt>
          <dd className="mt-1 text-sm leading-6 text-slate-700">
            {scenario.possibleConsequence}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-slate-900">
            Safer next action
          </dt>
          <dd className="mt-1 text-sm leading-6 text-slate-700">
            {scenario.recommendedResponse}
          </dd>
        </div>
        <div className="border-l-2 border-slate-400 pl-4">
          <dt className="text-sm font-semibold text-slate-900">Key takeaway</dt>
          <dd className="mt-1 text-sm leading-6 text-slate-700">
            {scenario.takeaway}
          </dd>
        </div>
      </dl>
    </section>
  );
}
