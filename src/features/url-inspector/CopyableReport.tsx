import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { buildUrlReport } from "./report";
import type { UrlAnalysisResult } from "./types";

type CopyStatus = "idle" | "copied" | "error";

export function CopyableReport({ result }: { result: UrlAnalysisResult }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const report = buildUrlReport(result);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(report);
      } else {
        throw new Error("Clipboard unavailable");
      }
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <details className="group mt-5 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-4 text-sm font-medium text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:text-slate-100 dark:focus-visible:outline-slate-300">
        Copyable analysis report
        <span
          aria-hidden="true"
          className="text-xs font-normal text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          A plain-text summary of this analysis. User information and query
          values are omitted. Review the text before sharing it.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" onClick={handleCopy}>
            {status === "copied" ? (
              <Check aria-hidden="true" size={15} strokeWidth={2} />
            ) : (
              <Copy aria-hidden="true" size={15} strokeWidth={2} />
            )}
            {status === "copied" ? "Copied" : "Copy report"}
          </Button>
          <span
            role="status"
            aria-live="polite"
            className="text-xs text-slate-600 dark:text-slate-300"
          >
            {status === "copied"
              ? "Report copied to the clipboard."
              : status === "error"
                ? "Copy failed. Select the text below and copy it manually."
                : ""}
          </span>
        </div>
        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          {report}
        </pre>
      </div>
    </details>
  );
}
