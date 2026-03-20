export default function ChatHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full shrink-0" />
      <div className="space-y-1.5">
        <div className="bg-slate-200 dark:bg-slate-700 animate-pulse w-28 h-3.5 rounded" />
        <div className="bg-slate-200 dark:bg-slate-700 animate-pulse w-14 h-2.5 rounded" />
      </div>
    </div>
  );
}
