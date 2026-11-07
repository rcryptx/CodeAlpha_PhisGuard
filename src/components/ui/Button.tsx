import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
        variant === 'primary' && 'border-slate-900 bg-slate-900 text-white hover:bg-slate-700',
        variant === 'secondary' && 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-100',
        variant === 'ghost' && 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
