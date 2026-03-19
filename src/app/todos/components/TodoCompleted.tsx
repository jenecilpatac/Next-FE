import useFetch from "../hooks/fetchData";
import SingleStatusLoader from "./loaders/SingleStatusLoader";
import StatusTodoCard from "./StatusTodoCard";

export default function TodoCompleted({
  isSingleStatusRefresh,
  handleDeleteTodo,
  handleStatusUpdate,
  setIsEdited,
  isEdited,
  setId,
}: any) {
  const { data, loading }: any = useFetch(
    "/todos/status/done",
    isSingleStatusRefresh,
  );

  const handleEditTodo = (id: number) => {
    setIsEdited((p: any) => ({ [id]: !p[id] }));
    setId(id);
  };

  if (loading) return <SingleStatusLoader />;

  if (!data?.todo?.length)
    return (
      <div className="py-8 text-center">
        <i className="fa-solid fa-circle-check text-2xl text-green-200 dark:text-green-900 mb-2 block"></i>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          No completed tasks
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
          handleEditTodo={handleEditTodo}
          isEdited={isEdited}
          actions={[
            { status: "pending", key: "reset" },
            { status: "ongoing", key: "pending" },
            { status: "cancelled", key: "cancelled" },
          ]}
        />
      ))}
    </div>
  );
}
