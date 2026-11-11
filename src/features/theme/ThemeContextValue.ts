import { createContext } from "react";
import type { AppThemeMode } from "@/types/app";

export const THEME_STORAGE_KEY = "phisguard.theme";

export interface ThemeContextValue {
  theme: AppThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: AppThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
