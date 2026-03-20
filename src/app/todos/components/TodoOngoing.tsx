import useFetch from "../hooks/fetchData";
import SingleStatusLoader from "./loaders/SingleStatusLoader";
import StatusTodoCard from "./StatusTodoCard";

export default function TodoOngoing({
  isSingleStatusRefresh,
  handleDeleteTodo,
  handleStatusUpdate,
  setIsEdited,
  isEdited,
  setId,
}: any) {
  const { data, loading }: any = useFetch(
    "/todos/status/ongoing",
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
        <i className="fa-solid fa-arrows-rotate text-2xl text-blue-200 dark:text-blue-900 mb-2 block"></i>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          No ongoing tasks
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
            { status: "done", key: "done" },
            { status: "cancelled", key: "cancelled" },
          ]}
        />
      ))}
    </div>
  );
}
