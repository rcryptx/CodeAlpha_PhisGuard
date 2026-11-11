import { useEffect, useRef, useState, type FormEvent } from "react";

import { ZYNX_MAX_MESSAGE_LENGTH } from "./zynxApi";
import { useZynx } from "./useZynx";

const fieldClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300";

export function ZynxAssistant() {
  const {
    open,
    serviceState,
    messages,
    displayName,
    rememberName,
    isSending,
    error,
    memoryNotice,
    openAssistant,
    closeAssistant,
    submitName,
    setRememberName,
    forgetName,
    sendMessage,
    retry,
    clearConversation,
  } = useZynx();
  const [nameInput, setNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeAssistant();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeAssistant]);

  function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted = submitName(nameInput);
    setNameError(
      submitted ? null : "Enter a name or nickname of up to 48 characters.",
    );
    if (submitted) {
      setNameInput("");
    }
  }

  async function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = messageInput.trim();
    if (!message || message.length > ZYNX_MAX_MESSAGE_LENGTH) return;
    setMessageInput("");
    await sendMessage(message);
    messageInputRef.current?.focus();
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="zynx-assistant-panel"
        onClick={open ? closeAssistant : openAssistant}
        className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center justify-center rounded-full border border-slate-800 bg-slate-800 px-5 text-sm font-semibold text-white shadow-lg hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
      >
        {open ? "Close ZYNX" : "Ask ZYNX"}
      </button>

      {open && (
        <aside
          id="zynx-assistant-panel"
          aria-labelledby="zynx-panel-title"
          className="fixed inset-x-3 bottom-[4.75rem] z-40 flex max-h-[min(42rem,calc(100dvh-6rem))] flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl sm:inset-x-auto sm:right-4 sm:w-[min(26rem,calc(100vw-2rem))]"
        >
          <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2
                id="zynx-panel-title"
                className="text-base font-semibold text-slate-950"
              >
                ZYNX
              </h2>
              <p className="text-xs text-slate-600">
                Gemini-powered learning assistant
              </p>
            </div>
            <button
              type="button"
              onClick={closeAssistant}
              aria-label="Close ZYNX assistant"
              className="min-h-9 rounded-lg px-3 text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Close
            </button>
          </header>

          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
            aria-live="polite"
            aria-relevant="additions text"
          >
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2.5 text-sm leading-6 text-slate-800">
              {displayName ? (
                <>
                  Hi, {displayName}. I’m ZYNX, your PhisGuard learning
                  assistant. Ask me about cybersecurity concepts, lessons, or
                  how to use the app.
                </>
              ) : (
                <>
                  Hi, I’m ZYNX, your PhisGuard learning assistant. What would
                  you like me to call you?
                </>
              )}
            </div>

            {memoryNotice && (
              <p
                role="status"
                className="rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs leading-5 text-amber-950"
              >
                {memoryNotice}
              </p>
            )}

            {!displayName ? (
              <form className="space-y-3" onSubmit={handleNameSubmit}>
                <label
                  htmlFor="zynx-name"
                  className="block text-xs font-medium text-slate-700"
                >
                  Your name or nickname
                </label>
                <input
                  id="zynx-name"
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  maxLength={48}
                  autoComplete="nickname"
                  className={fieldClassName}
                />
                <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberName}
                    onChange={(event) => setRememberName(event.target.checked)}
                    className="mt-1 accent-slate-800"
                  />
                  Remember this name on this device. Off by default; chat
                  history is never saved.
                </label>
                {nameError && (
                  <p role="alert" className="text-xs text-red-700">
                    {nameError}
                  </p>
                )}
                <button
                  type="submit"
                  className="min-h-10 rounded-full border border-slate-800 bg-slate-800 px-4 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Continue
                </button>
              </form>
            ) : (
              <>
                {messages.map((message) => (
                  <p
                    key={message.id}
                    className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2.5 text-sm leading-6 ${
                      message.role === "user"
                        ? "ml-auto rounded-tr-sm bg-slate-800 text-white"
                        : "rounded-tl-sm bg-slate-100 text-slate-800"
                    }`}
                    aria-label={
                      message.role === "user" ? "Your message" : "ZYNX response"
                    }
                  >
                    {message.content}
                  </p>
                ))}
                {isSending && (
                  <p role="status" className="text-sm text-slate-600">
                    ZYNX is responding…
                  </p>
                )}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm leading-5 text-red-900"
                  >
                    <p>{error}</p>
                    {serviceState === "available" &&
                      messages.at(-1)?.role === "user" && (
                        <button
                          type="button"
                          onClick={() => void retry()}
                          className="mt-2 font-medium underline underline-offset-2"
                        >
                          Retry
                        </button>
                      )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-slate-200 p-3">
            {serviceState === "checking" && (
              <p role="status" className="mb-2 text-xs text-slate-600">
                Checking assistant availability…
              </p>
            )}
            {serviceState === "unconfigured" && (
              <p
                role="status"
                className="mb-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs leading-5 text-amber-950"
              >
                Gemini is not configured on the server. Add{" "}
                <code>GEMINI_API_KEY</code> to the server environment and
                restart the ZYNX service.
              </p>
            )}
            {serviceState === "offline" && (
              <div className="mb-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs leading-5 text-amber-950">
                <p>The local ZYNX service is unavailable.</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-1 font-medium underline underline-offset-2"
                >
                  Retry after starting the server
                </button>
              </div>
            )}

            {displayName && (
              <>
                <form className="flex gap-2" onSubmit={handleMessageSubmit}>
                  <label className="sr-only" htmlFor="zynx-message">
                    Message ZYNX
                  </label>
                  <textarea
                    id="zynx-message"
                    ref={messageInputRef}
                    rows={2}
                    maxLength={ZYNX_MAX_MESSAGE_LENGTH}
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Ask a cybersecurity or PhisGuard question"
                    className={`${fieldClassName} min-h-11 resize-y`}
                    disabled={serviceState !== "available" || isSending}
                  />
                  <button
                    type="submit"
                    disabled={
                      serviceState !== "available" ||
                      isSending ||
                      messageInput.trim().length === 0
                    }
                    className="min-h-11 self-end rounded-xl border border-slate-800 bg-slate-800 px-3 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Send
                  </button>
                </form>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Messages are sent to Google Gemini. Don’t include passwords,
                  account details, or other sensitive information. ZYNX is
                  educational and cannot confirm that a URL, file, or system is
                  safe.
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberName}
                      onChange={(event) =>
                        setRememberName(event.target.checked)
                      }
                      className="accent-slate-800"
                    />
                    Remember my name on this device
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={clearConversation}
                      className="underline underline-offset-2"
                    >
                      Clear chat
                    </button>
                    <button
                      type="button"
                      onClick={forgetName}
                      className="underline underline-offset-2"
                    >
                      Forget name
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
