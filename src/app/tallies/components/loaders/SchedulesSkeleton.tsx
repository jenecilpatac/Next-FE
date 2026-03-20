const SchedulesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 animate-pulse">
        {/* Score */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-32 mx-auto mb-4" />
        {/* Logos */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="w-6 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-24 mx-auto" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mx-auto" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14 mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default SchedulesSkeleton;
