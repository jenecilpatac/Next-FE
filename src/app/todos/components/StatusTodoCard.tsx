const statusBadge: any = {
  pending:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  ongoing: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  done: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const actionButtons: any = {
  pending: {
    icon: "fa-arrows-rotate",
    title: "Mark ongoing",
    color:
      "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40",
  },
  done: {
    icon: "fa-check-double",
    title: "Mark done",
    color:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40",
  },
  reset: {
    icon: "fa-rotate-left",
    title: "Back to pending",
    color:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40",
  },
  cancelled: {
    icon: "fa-ban",
    title: "Cancel",
    color:
      "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40",
  },
};

interface StatusTodoCardProps {
  item: any;
  handleStatusUpdate: (id: number, status: string) => void;
  handleDeleteTodo?: (id: number) => void;
  handleEditTodo?: (id: number) => void;
  isEdited?: any;
  actions: { status: string; key: string }[];
}

export default function StatusTodoCard({
  item,
  handleStatusUpdate,
  handleDeleteTodo,
  handleEditTodo,
  isEdited,
  actions,
}: StatusTodoCardProps) {
  const badge = statusBadge[item.status] ?? statusBadge.pending;

  return (
    <div className="bg-white dark:bg-gray-900 border hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
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
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${badge}`}
          >
            {item.status}
          </span>
          {handleEditTodo && (
            <button
              type="button"
              onClick={() => handleEditTodo(item.id)}
              title={isEdited?.[item.id] ? "Cancel edit" : "Edit"}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
            >
              <i
                className={`fa-solid ${isEdited?.[item.id] ? "fa-xmark" : "fa-pen"} text-[10px]`}
              ></i>
            </button>
          )}
          {handleDeleteTodo && (
            <button
              type="button"
              onClick={() => handleDeleteTodo(item.id)}
              title="Delete"
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
            >
              <i className="fa-solid fa-trash text-[10px]"></i>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p
        className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 break-words whitespace-break-spaces leading-relaxed"
        title={item.content}
      >
        {item.content}
      </p>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <span className="text-[10px] text-gray-400 dark:text-gray-600">
          Move to:
        </span>
        <div className="flex gap-1.5">
          {actions.map(({ status, key }) => {
            const btn = actionButtons[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleStatusUpdate(item.id, status)}
                title={btn.title}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${btn.color}`}
              >
                <i className={`fa-solid ${btn.icon} text-[10px]`}></i>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
