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
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:focus-visible:outline-slate-300',
        variant === 'primary' &&
          'border-slate-800 bg-slate-800 text-white hover:bg-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300',
        variant === 'secondary' &&
          'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
        variant === 'ghost' &&
          'border-transparent bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
