import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { analyzeUrl, urlSafetyDisclaimer } from "./analyzeUrl";
import { CopyableReport } from "./CopyableReport";
import { riskDescriptions, riskLabels, severityLabels, severityRank } from "./labels";
import { UrlAnatomyView } from "./UrlAnatomyView";
import type { FindingSeverity, UrlAnalysisResult } from "./types";

const severityPillStyles: Record<FindingSeverity, string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  low: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const severityAccentStyles: Record<FindingSeverity, string> = {
  high: "border-l-rose-400 dark:border-l-rose-400/70",
  medium: "border-l-amber-400 dark:border-l-amber-400/70",
  low: "border-l-slate-300 dark:border-l-slate-600",
};

function FindingsList({
  findings,
}: {
  findings: UrlAnalysisResult["findings"];
}) {
  if (findings.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          No structural indicators found
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          The URL did not match the current local rules. This is not a verdict
          about the website or its content.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {severityRank.map((severity) => {
        const group = findings.filter(
          (finding) => finding.severity === severity,
        );
        if (group.length === 0) return null;

        return (
          <section key={severity} aria-labelledby={`findings-${severity}`}>
            <h3
              id={`findings-${severity}`}
              className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300"
            >
              {severityLabels[severity]}
              <span
                className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-medium normal-case tracking-normal ${severityPillStyles[severity]}`}
              >
                {group.length}
              </span>
            </h3>
            <ul className="space-y-3">
              {group.map((finding) => (
                <li
                  key={finding.ruleId}
                  className={`rounded-xl border border-l-2 border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 ${severityAccentStyles[severity]}`}
                >
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {finding.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {finding.explanation}
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[6.5rem_1fr]">
                    <dt className="font-medium text-slate-600 dark:text-slate-400">
                      Evidence
                    </dt>
                    <dd className="break-words text-slate-800 dark:text-slate-200">
                      {finding.evidence}
                    </dd>
                    <dt className="font-medium text-slate-600 dark:text-slate-400">
                      Limitation
                    </dt>
                    <dd className="text-slate-800 dark:text-slate-200">
                      {finding.limitation}
                    </dd>
                    <dt className="font-medium text-slate-600 dark:text-slate-400">
                      Recommendation
                    </dt>
                    <dd className="text-slate-800 dark:text-slate-200">
                      {finding.recommendation}
                    </dd>
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
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-900"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="inspector-url"
          className="block text-sm font-medium text-slate-800 dark:text-slate-100"
        >
          URL to analyze
        </label>
        <p id="inspector-help" className="mt-1 text-sm text-slate-600 dark:text-slate-300">
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
          className="mt-4 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-300 dark:focus:ring-slate-700"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="submit">Analyze URL</Button>
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </form>

      <aside className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
          Private by design
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This tool inspects URL text locally. It does not open or fetch the
          address, run its content, or send it to a server or reputation
          service. Submitted text is not saved by this page.
        </p>
        <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:text-slate-400">
          {urlSafetyDisclaimer}
        </p>
      </aside>

      {!result && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Ready to analyze
          </h2>
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
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-900/60"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start dark:border-slate-700">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Local structural analysis
              </p>
              <h2
                id="analysis-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
              >
                {riskLabels[result.risk]}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {riskDescriptions[result.risk]}
              </p>
            </div>
            {result.findings.length > 0 && (
              <span className="inline-flex w-fit rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200">
                {result.findings.length}{" "}
                {result.findings.length === 1 ? "finding" : "findings"}
              </span>
            )}
          </div>

          {result.error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              {result.error}
            </p>
          ) : (
            <>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-[6rem_1fr]">
                <dt className="font-medium text-slate-600 dark:text-slate-400">
                  Scheme
                </dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {result.protocol}
                </dd>
                <dt className="font-medium text-slate-600 dark:text-slate-400">
                  Hostname
                </dt>
                <dd className="break-all font-mono text-slate-800 dark:text-slate-200">
                  {result.hostname || "Not applicable for this scheme"}
                </dd>
                <dt className="font-medium text-slate-600 dark:text-slate-400">
                  Address
                </dt>
                <dd className="break-all font-mono text-slate-800 dark:text-slate-200">
                  {result.normalizedUrl}
                </dd>
              </dl>
              {result.anatomy && (
                <UrlAnatomyView
                  anatomy={result.anatomy}
                  findings={result.findings}
                />
              )}
              <FindingsList findings={result.findings} />
            </>
          )}

          <CopyableReport result={result} />
        </section>
      )}
    </div>
  );
}
