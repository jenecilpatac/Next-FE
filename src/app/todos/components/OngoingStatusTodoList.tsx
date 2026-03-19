import StatusTodoCard from "./StatusTodoCard";

export default function OngoingStatusTodoList({
  item,
  handleStatusUpdate,
}: any) {
  return (
    <StatusTodoCard
      item={item}
      handleStatusUpdate={handleStatusUpdate}
      actions={[
        { status: "pending", key: "reset" },
        { status: "done", key: "done" },
        { status: "cancelled", key: "cancelled" },
      ]}
    />
  );
}
