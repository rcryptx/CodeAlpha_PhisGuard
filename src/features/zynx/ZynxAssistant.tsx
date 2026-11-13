import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, RotateCcw, Send, X } from "lucide-react";

import { ZYNX_MAX_MESSAGE_LENGTH } from "./zynxApi";
import { useZynx } from "./useZynx";

const fieldClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-700";

function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

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
        aria-label={open ? "Close ZYNX assistant" : "Open ZYNX assistant"}
        title={open ? "Close ZYNX assistant" : "Open ZYNX assistant"}
        aria-expanded={open}
        aria-controls="zynx-assistant-panel"
        onClick={open ? closeAssistant : openAssistant}
        className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-white shadow-lg transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 dark:border-slate-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        <Bot aria-hidden="true" size={23} strokeWidth={1.75} />
      </button>

      {open && (
        <aside
          id="zynx-assistant-panel"
          aria-labelledby="zynx-panel-title"
          className="fixed inset-x-3 bottom-[4.75rem] z-40 flex max-h-[min(42rem,calc(100dvh-6rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:inset-x-auto sm:right-4 sm:w-[min(26rem,calc(100vw-2rem))]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                <Bot aria-hidden="true" size={21} strokeWidth={1.75} />
              </span>
              <h2
                id="zynx-panel-title"
                className="text-base font-semibold tracking-tight text-slate-950 dark:text-white"
              >
                <span className="block">ZYNX</span>
                <span className="mt-0.5 block text-xs font-normal text-slate-500 dark:text-slate-400">
                  Personal learning companion
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={closeAssistant}
              aria-label="Close ZYNX assistant"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X aria-hidden="true" size={18} strokeWidth={1.75} />
            </button>
          </header>

          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4 dark:bg-slate-950"
            aria-live="polite"
            aria-relevant="additions text"
            aria-busy={isSending}
          >
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
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
                className="rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs leading-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
              >
                {memoryNotice}
              </p>
            )}

            {!displayName ? (
              <form className="space-y-3" onSubmit={handleNameSubmit}>
                <label
                  htmlFor="zynx-name"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Your name or nickname
                </label>
                <input
                  id="zynx-name"
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  maxLength={48}
                  autoComplete="nickname"
                  className={`${fieldClassName} py-3`}
                />
                <label className="flex items-start gap-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberName}
                    onChange={(event) => setRememberName(event.target.checked)}
                    className="mt-1 accent-slate-800 dark:accent-slate-200"
                  />
                  Remember this name on this device. Off by default; chat
                  history is never saved.
                </label>
                {nameError && (
                  <p
                    role="alert"
                    className="text-xs text-red-700 dark:text-red-300"
                  >
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
                  <div
                    key={message.id}
                    className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2.5 text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "ml-auto rounded-tr-sm bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "rounded-tl-sm border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    <p
                      aria-label={
                        message.role === "user"
                          ? "Your message"
                          : "ZYNX response"
                      }
                    >
                      {message.content}
                    </p>
                    <time
                      dateTime={message.createdAt}
                      title={new Date(message.createdAt).toLocaleString()}
                      className={`mt-1.5 block text-[11px] leading-4 ${
                        message.role === "user"
                          ? "text-slate-300 dark:text-slate-600"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                ))}
                {isSending && (
                  <div
                    role="status"
                    aria-label="ZYNX is responding"
                    className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <span
                      aria-hidden="true"
                      className="flex items-center gap-1"
                    >
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
                    </span>
                    ZYNX is responding
                  </div>
                )}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm leading-5 text-red-900 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
                  >
                    <p>{error}</p>
                    {serviceState === "available" &&
                      messages.at(-1)?.role === "user" && (
                        <button
                          type="button"
                          onClick={() => void retry()}
                          className="mt-2 inline-flex items-center gap-1.5 font-medium underline underline-offset-2"
                        >
                          <RotateCcw
                            aria-hidden="true"
                            size={13}
                            strokeWidth={1.75}
                          />
                          Retry
                        </button>
                      )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            {serviceState === "checking" && (
              <p
                role="status"
                className="mb-2 text-xs text-slate-600 dark:text-slate-400"
              >
                Checking assistant availability…
              </p>
            )}
            {serviceState === "unconfigured" && (
              <p
                role="status"
                className="mb-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs leading-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
              >
                Gemini is not configured on the server. Add{" "}
                <code>GEMINI_API_KEY</code> to the server environment and
                restart the ZYNX service.
              </p>
            )}
            {serviceState === "offline" && (
              <div className="mb-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs leading-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
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
                    disabled={
                      serviceState !== "available" ||
                      isSending ||
                      Boolean(error)
                    }
                  />
                  <button
                    type="submit"
                    disabled={
                      serviceState !== "available" ||
                      isSending ||
                      Boolean(error) ||
                      messageInput.trim().length === 0
                    }
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-end rounded-xl border border-slate-800 bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-slate-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    <Send aria-hidden="true" size={16} strokeWidth={1.75} />
                    <span>Send</span>
                  </button>
                </form>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Messages are sent to Google Gemini. Don’t include passwords,
                  account details, or other sensitive information. ZYNX is
                  educational and cannot confirm that a URL, file, or system is
                  safe.
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberName}
                      onChange={(event) =>
                        setRememberName(event.target.checked)
                      }
                      className="accent-slate-800 dark:accent-slate-200"
                    />
                    Remember my name on this device
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={clearConversation}
                      disabled={isSending}
                      className="underline underline-offset-2"
                    >
                      Clear chat
                    </button>
                    <button
                      type="button"
                      onClick={forgetName}
                      disabled={isSending}
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
