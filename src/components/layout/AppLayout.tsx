import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { appName, appTagline, navItems } from "@/config/site";
import { cn } from "@/lib/utils";

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
      "rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700",
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="shrink-0">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Cyber awareness
            </div>
            <NavLink
              to="/"
              className="mt-1 inline-block rounded-sm text-2xl font-semibold tracking-tight text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {appName}
            </NavLink>
          </div>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {mainNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            <details className="relative">
              <summary
                aria-current={moreIsActive ? "page" : undefined}
                className={cn(
                  "cursor-pointer list-none rounded-full px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700",
                  moreIsActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                More <span aria-hidden="true">⌄</span>
              </summary>
              <div className="absolute right-0 top-full z-10 mt-2 min-w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {moreNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(navLinkClass({ isActive }), "block rounded-lg")
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </details>
          </nav>

          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? "Close menu" : "Menu"}
          </button>
        </div>

        <nav
          id="mobile-primary-navigation"
          aria-label="Mobile primary navigation"
          hidden={!mobileMenuOpen}
          className="border-t border-slate-200 px-4 py-3 md:hidden"
        >
          <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={navLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            {appName} · {appTagline}
          </span>
          <NavLink
            className="w-fit rounded-sm underline underline-offset-4 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            to="/learn"
          >
            Visit the learning centre
          </NavLink>
        </div>
      </footer>
    </div>
  );
}
