export default function Content() {
  const sent = [52, 72, 44];
  const received = [72, 96, 60, 80];
  return (
    <>
      {received.map((w, i) => (
        <div key={`r${i}`} className="flex justify-start gap-2 items-end">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full shrink-0" />
          <div
            className={`h-9 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-2xl`}
            style={{ width: `${w * 4}px`, maxWidth: "70%" }}
          />
        </div>
      ))}
      {sent.map((w, i) => (
        <div key={`s${i}`} className="flex justify-end">
          <div
            className={`h-9 bg-blue-200 dark:bg-blue-900/40 animate-pulse rounded-2xl`}
            style={{ width: `${w * 4}px`, maxWidth: "70%" }}
          />
        </div>
      ))}
    </>
  );
}
