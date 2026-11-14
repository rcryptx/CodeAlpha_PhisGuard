import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { getGlossaryTerm } from "@/features/glossary/glossaryData";
import { lessonBySlug } from "@/features/learning/curriculum";

import { getZynxErrorMessage, ZYNX_MAX_MESSAGE_LENGTH } from "./zynxApi";
import { ZynxContext } from "./zynxContextValue";
import type { ServiceState, ZynxContextValue } from "./zynxContextValue";
import type { ZynxMessage, ZynxProfile } from "./types";

const ZYNX_MEMORY_KEY = "phisguard.zynx.profile";
const MAX_HISTORY_MESSAGES = 12;

function hasControlCharacters(value: string) {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

function readProfile(): {
  profile: ZynxProfile | null;
  notice: string | null;
} {
  try {
    const raw = window.localStorage.getItem(ZYNX_MEMORY_KEY);
    if (raw === null) return { profile: null, notice: null };
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("displayName" in parsed) ||
      typeof parsed.displayName !== "string" ||
      parsed.displayName.length > 48 ||
      !("consentToMemory" in parsed) ||
      parsed.consentToMemory !== true
    ) {
      return {
        profile: null,
        notice:
          "Saved ZYNX personalization could not be used. It was left unchanged in browser storage.",
      };
    }
    return {
      profile: {
        displayName: parsed.displayName,
        consentToMemory: true,
      },
      notice: null,
    };
  } catch {
    return {
      profile: null,
      notice:
        "Browser storage is unavailable. ZYNX will not remember your name after this session.",
    };
  }
}

function describeCurrentPage(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname === "/learn") return "Learning Centre";
  if (pathname === "/inspector") return "URL Inspector";
  if (pathname === "/practice") return "Practice Lab";
  if (pathname === "/assessments") return "Assessments";
  if (pathname === "/progress") return "Progress";
  if (pathname === "/resources") return "Resources";
  if (pathname === "/zynx") return "ZYNX";
  if (pathname === "/glossary") return "Glossary";
  if (pathname.startsWith("/glossary/")) {
    const term = getGlossaryTerm(pathname.slice("/glossary/".length));
    return term ? `Glossary: ${term.term}` : "Glossary";
  }
  if (pathname.startsWith("/learn/")) {
    return lessonBySlug(pathname.slice("/learn/".length))
      ? "Lesson page"
      : "PhisGuard";
  }
  return "PhisGuard";
}

function makeMessage(role: ZynxMessage["role"], content: string): ZynxMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function ZynxProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [initialProfile] = useState(readProfile);
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(
    initialProfile.profile?.displayName ?? "",
  );
  const [rememberName, setRememberNameState] = useState(
    initialProfile.profile?.consentToMemory ?? false,
  );
  const [memoryNotice, setMemoryNotice] = useState(initialProfile.notice);
  const [messages, setMessages] = useState<ZynxMessage[]>([]);
  const [serviceState, setServiceState] = useState<ServiceState>("unknown");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  const checkService = useCallback(async (): Promise<ServiceState> => {
    try {
      const response = await fetch("/api/zynx/status");
      if (!response.ok) throw new Error("Status request failed");
      const status: unknown = await response.json();
      const configured =
        typeof status === "object" &&
        status !== null &&
        "configured" in status &&
        status.configured === true;
      return configured ? "available" : "unconfigured";
    } catch {
      return "offline";
    }
  }, []);

  const saveMemory = useCallback((name: string, remember: boolean) => {
    try {
      if (remember) {
        const profile: ZynxProfile = {
          displayName: name,
          consentToMemory: true,
        };
        window.localStorage.setItem(ZYNX_MEMORY_KEY, JSON.stringify(profile));
      } else {
        window.localStorage.removeItem(ZYNX_MEMORY_KEY);
      }
      setMemoryNotice(null);
    } catch {
      setMemoryNotice(
        "Browser storage could not save this preference. Your name is only available during this session.",
      );
    }
  }, []);

  const submitName = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (
        trimmed.length === 0 ||
        trimmed.length > 48 ||
        hasControlCharacters(trimmed)
      ) {
        return false;
      }
      setDisplayName(trimmed);
      saveMemory(trimmed, rememberName);
      return true;
    },
    [rememberName, saveMemory],
  );

  const setRememberName = useCallback(
    (remember: boolean) => {
      setRememberNameState(remember);
      if (displayName) saveMemory(displayName, remember);
    },
    [displayName, saveMemory],
  );

  const forgetName = useCallback(() => {
    setDisplayName("");
    setRememberNameState(false);
    saveMemory("", false);
    setMessages([]);
    setLastUserMessage(null);
    setError(null);
  }, [saveMemory]);

  const transmit = useCallback(
    async (conversation: ZynxMessage[]) => {
      if (serviceState !== "available" || isSending) return;
      setIsSending(true);
      setError(null);
      try {
        const response = await fetch("/api/zynx/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: (() => {
              const history = conversation.slice(-MAX_HISTORY_MESSAGES);
              if (history[0]?.role === "assistant") history.shift();
              return history.map((message) => ({
                role: message.role === "assistant" ? "model" : "user",
                content: message.content,
              }));
            })(),
            displayName,
            pageContext: describeCurrentPage(pathname),
          }),
        });
        const result: unknown = await response.json();
        if (!response.ok) {
          throw new Error(getZynxErrorMessage(result));
        }
        const reply =
          typeof result === "object" && result !== null && "reply" in result
            ? result.reply
            : undefined;
        if (
          typeof result !== "object" ||
          result === null ||
          typeof reply !== "string" ||
          reply.trim() === ""
        ) {
          throw new Error("ZYNX returned an empty or invalid response.");
        }
        setMessages((current) => [...current, makeMessage("assistant", reply)]);
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "ZYNX could not complete that request. Please try again.",
        );
      } finally {
        setIsSending(false);
      }
    },
    [displayName, isSending, pathname, serviceState],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (
        trimmed.length === 0 ||
        trimmed.length > ZYNX_MAX_MESSAGE_LENGTH ||
        isSending
      ) {
        return;
      }
      const userMessage = makeMessage("user", trimmed);
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setLastUserMessage(trimmed);
      await transmit(nextMessages);
    },
    [isSending, messages, transmit],
  );

  const retry = useCallback(async () => {
    if (!lastUserMessage || isSending) return;
    await transmit(messages);
  }, [isSending, lastUserMessage, messages, transmit]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setLastUserMessage(null);
    setError(null);
  }, []);

  const openAssistant = useCallback(() => {
    setServiceState("checking");
    setOpen(true);
    void checkService().then(setServiceState);
  }, [checkService]);

  const closeAssistant = useCallback(() => setOpen(false), []);

  const value = useMemo<ZynxContextValue>(
    () => ({
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
    }),
    [
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
    ],
  );

  return <ZynxContext.Provider value={value}>{children}</ZynxContext.Provider>;
}
