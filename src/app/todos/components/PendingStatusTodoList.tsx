import StatusTodoCard from "./StatusTodoCard";

export default function PendingStatusTodoList({
  item,
  handleStatusUpdate,
}: any) {
  return (
    <StatusTodoCard
      item={item}
      handleStatusUpdate={handleStatusUpdate}
      actions={[
        { status: "ongoing", key: "pending" },
        { status: "done", key: "done" },
        { status: "cancelled", key: "cancelled" },
      ]}
    />
  );
}
