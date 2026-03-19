export default function Select({ label, error, ...props }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        {...props}
        className={`block w-full px-3 py-2 border rounded-xl shadow-sm text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error
            ? "border-red-400 dark:border-red-500"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <option value="" hidden>
          {label}
        </option>
        <option value="" disabled>
          {label}
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="NonBinary">Non binary</option>
        <option value="Other">Other</option>
        <option value="PreferNotToSay">Prefer not to say</option>
      </select>
      {error && <small className="text-red-500 mt-1 block">{error}</small>}
    </div>
  );
}
