export default function Input({ error, icon, ...props }: any) {
  return (
    <div>
      <div className="relative">
        <i
          className={`fa-solid fa-${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none`}
        />
        <input
          {...props}
          className={`w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-gray-400 border transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? "border-red-500" : "border-white/20 hover:border-white/40"}`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </p>
      )}
    </div>
  );
}
