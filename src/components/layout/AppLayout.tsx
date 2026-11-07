import { NavLink, Outlet } from 'react-router-dom';

import { appName, appTagline, navItems } from '@/config/site';
import { cn } from '@/lib/utils';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Cyber awareness</div>
            <NavLink to="/" className="mt-1 block text-2xl font-semibold tracking-tight text-slate-950">
              {appName}
            </NavLink>
          </div>

          <nav aria-label="Primary navigation" className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="text-right text-xs text-slate-500">
            <div className="font-medium uppercase tracking-[0.2em]">{appTagline}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
