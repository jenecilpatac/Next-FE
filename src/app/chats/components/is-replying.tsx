import { useAuth } from "@/app/context/AuthContext";
import formatMessages from "../utils/formatMessages";

export default function IsReplying({
  selectedMessage,
  setSelectedMessage,
}: any) {
  const { user }: any = useAuth();

  if (!selectedMessage) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-900/40">
      <div className="w-0.5 h-10 bg-blue-500 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          Replying to{" "}
          {selectedMessage?.sentBy?.id === user?.id
            ? "yourself"
            : (selectedMessage?.sentBy?.name ?? "Anonymous")}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {selectedMessage?.attachment
            ? "Attachment"
            : (formatMessages(selectedMessage?.content?.trim(), 8, 8) ?? " ")}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setSelectedMessage(null)}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors shrink-0"
      >
        <i className="fa-solid fa-xmark text-[10px]"></i>
      </button>
    </div>
  );
}
