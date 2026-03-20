export default function RecentChat() {
  return (
    <>
      {Array.from(Array(7)).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-xl"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse shrink-0" />
          <div className="flex-1 hidden md:block space-y-1.5">
            <div
              className={`h-3.5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${index % 2 === 0 ? "w-32" : "w-24"}`}
            />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-20" />
          </div>
        </div>
      ))}
    </>
  );
}
