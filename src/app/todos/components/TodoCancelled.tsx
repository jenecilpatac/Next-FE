import useFetch from "../hooks/fetchData";
import SingleStatusLoader from "./loaders/SingleStatusLoader";
import StatusTodoCard from "./StatusTodoCard";

export default function TodoCancelled({
  isSingleStatusRefresh,
  handleDeleteTodo,
  handleStatusUpdate,
}: any) {
  const { data, loading }: any = useFetch(
    "/todos/status/cancelled",
    isSingleStatusRefresh,
  );

  if (loading) return <SingleStatusLoader />;

  if (!data?.todo?.length)
    return (
      <div className="py-8 text-center">
        <i className="fa-solid fa-ban text-2xl text-red-200 dark:text-red-900 mb-2 block"></i>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          No cancelled tasks
        </p>
      </div>
    );

  return (
    <div className="h-[calc(100vh-30rem)] overflow-y-auto">
      {data.todo.map((item: any, index: number) => (
        <StatusTodoCard
          key={index}
          item={item}
          handleStatusUpdate={handleStatusUpdate}
          handleDeleteTodo={handleDeleteTodo}
          actions={[
            { status: "pending", key: "reset" },
            { status: "ongoing", key: "pending" },
            { status: "done", key: "done" },
          ]}
        />
      ))}
    </div>
  );
}
