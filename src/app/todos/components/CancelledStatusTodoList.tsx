import StatusTodoCard from "./StatusTodoCard";

export default function CancelledStatusTodoList({
  item,
  handleStatusUpdate,
}: any) {
  return (
    <StatusTodoCard
      item={item}
      handleStatusUpdate={handleStatusUpdate}
      actions={[
        { status: "pending", key: "reset" },
        { status: "ongoing", key: "pending" },
        { status: "done", key: "done" },
      ]}
    />
  );
}
