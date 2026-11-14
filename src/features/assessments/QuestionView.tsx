import type { AnswerOption, AssessmentQuestion } from "./types";

export function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelect,
}: {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelect: (option: AnswerOption) => void;
}) {
  return (
    <section
      aria-labelledby="question-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          Question {questionNumber} of {totalQuestions}
        </p>
        <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700">
          {question.difficulty}
        </span>
      </div>
      {question.scenarioContext && (
        <p className="mt-5 border-l-2 border-slate-300 pl-4 text-sm leading-6 text-slate-600">
          {question.scenarioContext}
        </p>
      )}
      <h2
        id="question-heading"
        className="mt-5 text-xl font-semibold leading-8 tracking-tight text-slate-950 sm:text-2xl"
      >
        {question.prompt}
      </h2>
      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-slate-700">
          Select one answer
        </legend>
        <div className="mt-3 space-y-3">
          {question.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-800 transition hover:border-slate-400 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-slate-700 has-[:checked]:border-slate-500 has-[:checked]:bg-slate-50 dark:hover:border-slate-500 dark:has-[:focus-visible]:outline-slate-300 dark:has-[:checked]:border-slate-300 dark:has-[:checked]:bg-slate-800"
            >
              <input
                type="radio"
                name={`answer-${question.id}`}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => onSelect(option)}
                className="mt-1 size-4 shrink-0 accent-slate-800 dark:accent-slate-200"
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="sr-only" aria-live="polite">
        {selectedOptionId ? "An answer is selected." : "No answer selected."}
      </p>
    </section>
  );
}
