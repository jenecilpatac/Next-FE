export default function Input({ error, icon, ...props }: any) {
  return (
    <div>
      <div className="relative">
        <i className={`fa-solid fa-${icon} absolute left-3 top-4 text-gray-400`}></i>
        <input
          {...props}
          className={`w-full pl-10 p-3 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error && "border border-red-500"
          }`}
        />
      </div>
      {error && <small className="text-red-500">{error}</small>}
    </div>
  );
}
