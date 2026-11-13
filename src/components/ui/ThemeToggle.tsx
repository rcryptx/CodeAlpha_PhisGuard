import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/features/theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" size={16} strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden="true" size={16} strokeWidth={1.75} />
      )}
    </button>
  );
}
