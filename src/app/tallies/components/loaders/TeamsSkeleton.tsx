const TeamsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 animate-pulse relative">
        {/* Conference badge */}
        <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
        {/* Logo */}
        <div className="flex justify-center my-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        {/* Name + abbr */}
        <div className="space-y-2 text-center">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mx-auto" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-10 mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default TeamsSkeleton;
