export default function AllTodosLoader() {
  return (
    <>
      {Array.from(Array(8)).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
            <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse shrink-0" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5 animate-pulse" />
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
