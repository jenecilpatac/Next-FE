export default function PendingStatusTodoList({
  item,
  handleStatusUpdate,
}: any) {
  return (
    <div className="h-40 p-5 dark:bg-gray-900 bg-gray-50 shadow-md w-full rounded-lg dark:hover:bg-gray-800 hover:bg-gray-100 hover:scale-105 transition-all duration-300 ease-in-out z-0">
      <div className="relative mb-2">
        <p className="text-lg font-bold truncate" title={item.title}>
          {item.title}
        </p>
        <span className="text-xs absolute capitalize -top-4 -right-2 rounded bg-red-500 px-2 bg-opacity-65 text-white">
          {item.status}
        </span>
      </div>
      <hr />
      <p className="text-sm line-clamp-2 mt-2 break-words whitespace-break-spaces" title={item.content}>
        {item.content}
      </p>
      <div className="flex justify-center space-x-5 mt-3">
        <button
          type="button"
          onClick={() => handleStatusUpdate(item.id, "ongoing")}
          className="hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <i className="fa-solid fa-check rounded-full border-green-600 hover:bg-green-500 hover:text-white text-green-600 border p-2 text-xs"></i>
        </button>
        <button
          type="button"
          onClick={() => handleStatusUpdate(item.id, "done")}
          className="hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <i className="fa-solid fa-check-double rounded-full border-blue-600 hover:bg-blue-500 hover:text-white text-blue-400 border p-2 text-xs"></i>
        </button>
        <button
          type="button"
          onClick={() => handleStatusUpdate(item.id, "cancelled")}
          className="hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <i className="fa-solid fa-ban rounded-full border-red-600 hover:bg-red-500 hover:text-white text-red-600 border p-2 text-xs"></i>
        </button>
      </div>
    </div>
  );
}
