import StatusTodoCard from "./StatusTodoCard";

export default function DoneStatusTodoList({ item, handleStatusUpdate }: any) {
  return (
    <StatusTodoCard
      item={item}
      handleStatusUpdate={handleStatusUpdate}
      actions={[
        { status: "pending", key: "reset" },
        { status: "ongoing", key: "pending" },
        { status: "cancelled", key: "cancelled" },
      ]}
    />
  );
}
