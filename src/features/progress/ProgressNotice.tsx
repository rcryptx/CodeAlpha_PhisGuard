export function ProgressNotice({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="status"
      className="mb-6 rounded-xl border border-slate-300 bg-slate-100 p-4 text-sm leading-6 text-slate-700"
    >
      {message}
    </p>
  );
}
