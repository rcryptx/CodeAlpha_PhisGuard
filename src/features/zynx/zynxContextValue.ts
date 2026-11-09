import { createContext } from "react";

import type { ZynxMessage } from "./types";

export type ServiceState =
  "unknown" | "checking" | "available" | "unconfigured" | "offline";

export interface ZynxContextValue {
  open: boolean;
  serviceState: ServiceState;
  messages: ZynxMessage[];
  displayName: string;
  rememberName: boolean;
  isSending: boolean;
  error: string | null;
  memoryNotice: string | null;
  openAssistant: () => void;
  closeAssistant: () => void;
  submitName: (name: string) => boolean;
  setRememberName: (remember: boolean) => void;
  forgetName: () => void;
  sendMessage: (content: string) => Promise<void>;
  retry: () => Promise<void>;
  clearConversation: () => void;
}

export const ZynxContext = createContext<ZynxContextValue | null>(null);
