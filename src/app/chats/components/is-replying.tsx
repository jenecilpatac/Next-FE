import { useAuth } from "@/app/context/AuthContext";
import formatMessages from "../utils/formatMessages";

export default function IsReplying({
  selectedMessage,
  setSelectedMessage,
}: any) {
  const { user }: any = useAuth();
  return (
    <div
      className={`p-4 bg-gray-100 dark:bg-gray-600 transition-all duration-300 ease-in-out border-t ${
        selectedMessage ? "" : "-mb-24"
      }`}
    >
      <div
        className={`${
          selectedMessage ? "visible" : "invisible"
        } flex justify-between items-center`}
      >
        <div className="flex flex-col gap-2 w-1/2 flex-1">
          <span className="text-lg font-bold dark:text-gray-300 text-gray-600">
            Replying to{" "}
            {selectedMessage?.sentBy?.id === user?.id
              ? "Yourself"
              : selectedMessage?.sentBy?.name ?? "Anonymous"}
          </span>
          <span className="text-gray-500 dark:text-gray-400 line-clamp-2 whitespace-break-spaces break-words">
            {selectedMessage?.attachment
              ? "Attachment"
              : formatMessages(selectedMessage?.content?.trim(), 8, 8) ?? " "}
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
