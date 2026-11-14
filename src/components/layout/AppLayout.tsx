import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bot,
  BookMarked,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  Home,
  Layers,
  LibraryBig,
  Menu,
  ScanSearch,
  X,
  type LucideIcon,
} from "lucide-react";

import { appName, appTagline, navItems } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeProvider } from "@/features/theme/ThemeContext";
import { ZynxAssistant } from "@/features/zynx/ZynxAssistant";
import { ZynxProvider } from "@/features/zynx/ZynxContext";
import { cn } from "@/lib/utils";

const navIcons: Record<(typeof navItems)[number]["to"], LucideIcon> = {
  "/": Home,
  "/learn": BookOpen,
  "/inspector": ScanSearch,
  "/practice": FlaskConical,
  "/flashcards": Layers,
  "/assessments": ClipboardCheck,
  "/progress": ChartNoAxesColumnIncreasing,
  "/glossary": BookMarked,
  "/resources": LibraryBig,
  "/zynx": Bot,
};

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const mainNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);
  const moreIsActive = moreNavItems.some(
    ({ to }) => pathname === to || pathname.startsWith(`${to}/`),
  );

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300",
      isActive
        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    );

  return (
    <ThemeProvider>
      <ZynxProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
          <header className="border-b border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="shrink-0">
                <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Cyber awareness
                </div>
                <NavLink
                  to="/"
                  className="mt-1 inline-block rounded-sm text-2xl font-semibold tracking-tight text-slate-950 transition-colors dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {appName}
                </NavLink>
              </div>

              <nav
                aria-label="Primary navigation"
                className="hidden items-center gap-1 md:flex"
              >
                {mainNavItems.map((item) => {
                  const Icon = navIcons[item.to];
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={navLinkClass}
                    >
                      <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
                      {item.label}
                    </NavLink>
                  );
                })}
                <details className="relative">
                  <summary
                    aria-current={moreIsActive ? "page" : undefined}
                    className={cn(
                      "inline-flex cursor-pointer list-none items-center gap-1 rounded-full px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300",
                      moreIsActive
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    )}
                  >
                    More
                    <ChevronDown
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.75}
                    />
                  </summary>
                  <div className="absolute right-0 top-full z-10 mt-2 min-w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    {moreNavItems.map((item) => {
                      const Icon = navIcons[item.to];
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            cn(navLinkClass({ isActive }), "rounded-lg")
                          }
                        >
                          <Icon
                            aria-hidden="true"
                            size={16}
                            strokeWidth={1.75}
                          />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </details>

                <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <ThemeToggle />
                </div>
              </nav>

              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-primary-navigation"
                  onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
                >
                  {mobileMenuOpen ? (
                    <X aria-hidden="true" size={17} strokeWidth={1.75} />
                  ) : (
                    <Menu aria-hidden="true" size={17} strokeWidth={1.75} />
                  )}
                  {mobileMenuOpen ? "Close menu" : "Menu"}
                </button>
              </div>
            </div>

            <nav
              id="mobile-primary-navigation"
              aria-label="Mobile primary navigation"
              hidden={!mobileMenuOpen}
              className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-900"
            >
              <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-3">
                {navItems.map((item) => {
                  const Icon = navIcons[item.to];
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={navLinkClass}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </main>
          <footer className="border-t border-slate-200 dark:border-slate-800">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <span>
                {appName} · {appTagline}
              </span>
              <NavLink
                className="w-fit rounded-sm underline underline-offset-4 hover:text-slate-900 dark:hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                to="/learn"
              >
                Visit the learning centre
              </NavLink>
            </div>
          </footer>
          <ZynxAssistant />
        </div>
      </ZynxProvider>
    </ThemeProvider>
  );
}
