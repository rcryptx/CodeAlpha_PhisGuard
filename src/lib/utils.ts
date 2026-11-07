export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDateLabel(date: Date | string) {
  const value = date instanceof Date ? date : new Date(date);

  return Number.isNaN(value.getTime())
    ? 'Unscheduled'
    : new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(value);
}
