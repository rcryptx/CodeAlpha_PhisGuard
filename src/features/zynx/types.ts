export interface ZynxMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ZynxProfile {
  displayName: string;
  consentToMemory: true;
}
