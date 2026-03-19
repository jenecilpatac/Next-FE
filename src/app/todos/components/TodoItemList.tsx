const statusConfig: any = {
  pending: {
    color:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  },
  ongoing: {
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  done: {
    color:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  cancelled: {
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
};

export default function TodoItemList({
  item,
  setIsEdited,
  isEdited,
  setId,
  handleStatusUpdate,
}: any) {
  const handleToEditTodo = (id: number) => {
    setIsEdited((p: any) => ({ [id]: !p[id] }));
    setId(id);
  };

  const cfg = statusConfig[item.status] ?? statusConfig.pending;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-sm font-bold text-gray-900 dark:text-white truncate flex-1"
          title={item.title}
        >
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${cfg.color}`}
          >
            {item.status}
          </span>
          <button
            type="button"
            onClick={() => handleToEditTodo(item.id)}
            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${isEdited[item.id] ? "bg-gray-100 dark:bg-gray-800 text-gray-500" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"}`}
          >
            <i
              className={`fa-solid ${isEdited[item.id] ? "fa-xmark" : "fa-pen"} text-[10px]`}
            ></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <p
        className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 break-words whitespace-break-spaces leading-relaxed"
        title={item.content}
      >
        {item.content}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
        <span className="text-[10px] text-gray-400">Change status:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleStatusUpdate(item.id, "ongoing")}
            title="Mark ongoing"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <i className="fa-solid fa-arrows-rotate text-[10px]"></i>
          </button>
          <button
            type="button"
            onClick={() => handleStatusUpdate(item.id, "done")}
            title="Mark done"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
          >
            <i className="fa-solid fa-check text-[10px]"></i>
          </button>
          <button
            type="button"
            onClick={() => handleStatusUpdate(item.id, "cancelled")}
            title="Cancel"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <i className="fa-solid fa-ban text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
