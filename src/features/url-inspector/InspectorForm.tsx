import { useState, type FormEvent } from "react";

import { analyzeUrl, urlSafetyDisclaimer } from "./analyzeUrl";
import type { FindingSeverity, UrlAnalysisResult } from "./types";

const severityOrder: FindingSeverity[] = ["high", "medium", "low"];

const riskLabels: Record<UrlAnalysisResult["risk"], string> = {
  "invalid-url": "Invalid URL",
  "high-concern": "High concern",
  suspicious: "Suspicious",
  "low-concern": "Low concern",
  "no-obvious-indicators": "No obvious structural indicators detected",
};

const riskDescriptions: Record<UrlAnalysisResult["risk"], string> = {
  "invalid-url": "This input could not be analyzed as a valid absolute URL.",
  "high-concern": "One or more high-severity structural indicators were found.",
  suspicious: "One or more medium-severity structural indicators were found.",
  "low-concern": "Only low-severity structural indicators were found.",
  "no-obvious-indicators":
    "No indicators from the current set of local structural rules were found.",
};

const severityLabels: Record<FindingSeverity, string> = {
  high: "High severity",
  medium: "Medium severity",
  low: "Low severity",
};

const severityStyles: Record<FindingSeverity, string> = {
  high: "border-slate-400 bg-slate-100",
  medium: "border-slate-300 bg-white",
  low: "border-slate-200 bg-slate-50",
};

function FindingsList({
  findings,
}: {
  findings: UrlAnalysisResult["findings"];
}) {
  if (findings.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">
          No structural indicators found
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The URL did not match the current local rules. This is not a verdict
          about the website or its content.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {severityOrder.map((severity) => {
        const group = findings.filter(
          (finding) => finding.severity === severity,
        );
        if (group.length === 0) return null;

        return (
          <section key={severity} aria-labelledby={`findings-${severity}`}>
            <h3
              id={`findings-${severity}`}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
            >
              {severityLabels[severity]} · {group.length}
            </h3>
            <ul className="space-y-3">
              {group.map((finding) => (
                <li
                  key={finding.ruleId}
                  className={`rounded-xl border p-5 ${severityStyles[severity]}`}
                >
                  <h4 className="font-semibold text-slate-900">
                    {finding.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {finding.explanation}
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[5.5rem_1fr]">
                    <dt className="font-medium text-slate-600">Evidence</dt>
                    <dd className="break-words text-slate-800">
                      {finding.evidence}
                    </dd>
                    <dt className="font-medium text-slate-600">
                      Recommendation
                    </dt>
                    <dd className="text-slate-800">{finding.recommendation}</dd>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function InspectorForm() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(analyzeUrl(value));
  }

  function handleClear() {
    setValue("");
    setResult(null);
  }

  return (
    <div className="space-y-6">
      <form
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="inspector-url"
          className="block text-sm font-medium text-slate-800"
        >
          URL to analyze
        </label>
        <p id="inspector-help" className="mt-1 text-sm text-slate-600">
          Enter a complete HTTP or HTTPS address. Analysis happens in this
          browser.
        </p>
        <input
          id="inspector-url"
          aria-describedby="inspector-help"
          autoComplete="url"
          inputMode="url"
          name="url"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://example.com"
          className="mt-4 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-300"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Analyze URL
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Clear
          </button>
        </div>
      </form>

      <aside className="rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900">Private by design</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This tool inspects URL text locally. It does not open or fetch the
          address, run its content, or send it to a server or reputation
          service. Submitted text is not saved by this page.
        </p>
        <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600">
          {urlSafetyDisclaimer}
        </p>
      </aside>

      {!result && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm leading-6 text-slate-600">
          <h2 className="font-semibold text-slate-900">Ready to analyze</h2>
          <p className="mt-2">
            Results describe URL structure only. Start with a link you are
            unsure about, and use the findings as signals to verify—not as a
            definitive verdict.
          </p>
        </div>
      )}

      {result && (
        <section
          aria-labelledby="analysis-heading"
          aria-live="polite"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Local structural analysis
              </p>
              <h2
                id="analysis-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
              >
                {riskLabels[result.risk]}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {riskDescriptions[result.risk]}
              </p>
            </div>
            {result.findings.length > 0 && (
              <span className="inline-flex w-fit rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">
                {result.findings.length}{" "}
                {result.findings.length === 1 ? "finding" : "findings"}
              </span>
            )}
          </div>

          {result.error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-800"
            >
              {result.error}
            </p>
          ) : (
            <>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-[6rem_1fr]">
                <dt className="font-medium text-slate-600">Scheme</dt>
                <dd className="text-slate-800">{result.protocol}</dd>
                <dt className="font-medium text-slate-600">Hostname</dt>
                <dd className="break-all font-mono text-slate-800">
                  {result.hostname || "Not applicable for this scheme"}
                </dd>
                <dt className="font-medium text-slate-600">Address</dt>
                <dd className="break-all font-mono text-slate-800">
                  {result.normalizedUrl}
                </dd>
              </dl>
              <FindingsList findings={result.findings} />
            </>
          )}
        </section>
      )}
    </div>
  );
}
