export type ZynxPreferenceKey = 'name' | 'theme' | 'learningGoals' | 'memoryConsent';

export interface ZynxPreference {
  key: ZynxPreferenceKey;
  value: string | boolean;
  updatedAt: string;
}

export interface ZynxMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ZynxProfile {
  displayName?: string;
  personalization: string[];
  consentToMemory: boolean;
  preferences: ZynxPreference[];
}
