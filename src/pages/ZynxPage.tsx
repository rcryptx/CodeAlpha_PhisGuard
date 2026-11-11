import { PageMetadata } from "@/components/seo/PageMetadata";
import { useZynx } from "@/features/zynx/useZynx";

export function ZynxPage() {
  const { openAssistant } = useZynx();

  return (
    <>
      <PageMetadata
        title="ZYNX learning assistant"
        description="Ask ZYNX about cybersecurity concepts, PhisGuard lessons, and how to use the learning tools."
        path="/zynx"
      />
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-slate-200 pb-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Optional AI learning companion
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            ZYNX
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Ask about phishing concepts, your current lesson, assessment
            feedback, URL Inspector indicators, or navigating PhisGuard. ZYNX
            uses Gemini and is available from the assistant button throughout
            the app.
          </p>
        </header>
        <section className="mt-7 max-w-2xl">
          <h2 className="text-xl font-semibold text-slate-900">
            Your privacy and ZYNX’s limits
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>
              Messages you send are transmitted to Google Gemini to generate a
              response. Do not send passwords, account details, or confidential
              information.
            </li>
            <li>
              Conversation history is kept in memory for this page session only;
              it is not saved by PhisGuard.
            </li>
            <li>
              Your name is only saved on this device if you explicitly enable
              the memory option. You can turn it off or forget it at any time.
            </li>
            <li>
              ZYNX has no browser, filesystem, or system tools and cannot verify
              a URL, file, or system as safe. Use PhisGuard’s deterministic URL
              Inspector for structural URL analysis.
            </li>
          </ul>
          <button
            type="button"
            onClick={openAssistant}
            className="mt-6 min-h-11 rounded-full border border-slate-800 bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Open ZYNX assistant
          </button>
        </section>
      </div>
    </>
  );
}
