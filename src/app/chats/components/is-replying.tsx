import { useAuth } from "@/app/context/AuthContext";
import formatMessages from "../utils/formatMessages";

export default function IsReplying({
  selectedMessage,
  setSelectedMessage,
}: any) {
  const { user }: any = useAuth();
  if (!selectedMessage) return;
  return (
    <div
      className={`p-4 bg-gray-100 dark:bg-gray-600 transition-all duration-300 ease-in-out ${
        selectedMessage ? "" : "-mb-28"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 w-1/2 flex-1">
          <span className="text-lg font-bold dark:text-gray-300 text-gray-600">
            Replying to{" "}
            {selectedMessage?.sentBy?.id === user?.id
              ? "Yourself"
              : selectedMessage?.sentBy?.name ?? "Anonymous"}
          </span>
          <span className="text-gray-500 dark:text-gray-400 line-clamp-2 whitespace-break-spaces break-words">
            {formatMessages(selectedMessage?.content?.trim(), 8, 8) ??
              "Attachment"}
          </span>
        </div>
        <button
          className="px-2"
          type="button"
          onClick={() => {
            setSelectedMessage(null);
          }}
        >
          <i className="far fa-x"></i>
        </button>
      </div>
    </div>
  );
}
