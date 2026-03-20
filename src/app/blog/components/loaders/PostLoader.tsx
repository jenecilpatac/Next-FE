export default function PostLoader() {
  return (
    <>
      {Array.from(Array(4)).map((_, index) => (
        <div key={index} className="mb-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-full h-56 bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5 animate-pulse" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/5 animate-pulse" />
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-24 animate-pulse" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28 animate-pulse" />
            </div>
            <div className="flex border-t border-gray-200 dark:border-gray-700">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-9 bg-slate-200 dark:bg-slate-700 animate-pulse mx-1 my-1 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
