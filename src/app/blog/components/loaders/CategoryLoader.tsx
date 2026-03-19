export default function CategoryLoader() {
  return (
    <>
      {Array.from(Array(8)).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="p-5">
            <div className="flex justify-between mb-3">
              <div className="bg-slate-200 dark:bg-slate-700 h-5 rounded w-2/3 animate-pulse" />
              <div className="bg-slate-200 dark:bg-slate-700 h-5 rounded w-14 animate-pulse" />
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 h-3.5 rounded w-full mb-2 animate-pulse" />
            <div className="bg-slate-200 dark:bg-slate-700 h-3.5 rounded w-5/6 mb-2 animate-pulse" />
            <div className="bg-slate-200 dark:bg-slate-700 h-3.5 rounded w-4/6 mb-5 animate-pulse" />
            <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-24 animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
}
