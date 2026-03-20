export default function ProfileLoader() {
  return (
    <>
      {/* Cover skeleton */}
      <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-b-2xl animate-pulse" />

      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14">
          {/* Avatar skeleton */}
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-950 bg-gray-300 dark:bg-gray-700 animate-pulse" />
          {/* Buttons skeleton */}
          <div className="flex gap-2">
            <div className="w-28 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-24 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>

        {/* Name / job skeleton */}
        <div className="mt-3 space-y-2">
          <div className="w-40 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-24 h-4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* Bio skeleton */}
        <div className="mt-3 w-72 h-4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />

        {/* Pills skeleton */}
        <div className="flex gap-2 mt-3">
          {[64, 80, 96].map((w) => (
            <div key={w} className={`h-6 w-${w / 4} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse`} />
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="px-6 mt-2">
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 pb-2">
          <div className="w-16 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-16 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    </>
  );
}
