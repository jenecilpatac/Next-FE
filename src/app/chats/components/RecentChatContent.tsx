import Link from "next/link";
import Image from "./images/Image";
import dateFormat from "../utils/dateFormat";
import formatRecentMessages from "../utils/formatRecentMessages";
import { useAuth } from "@/app/context/AuthContext";

export default function RecentChatContent({
  user,
  lastMessage,
  timeSent,
  setSearchTerm,
  searchTerm,
  unreadMessages,
  isActive,
  isDeleted,
  lastMessageOwnerId,
  formInput,
  userIdITyped,
  isAttached,
}: any) {
  const { user: authUser }: any = useAuth();
  const messageDraft = localStorage.getItem(
    `private-${user?.id}-${authUser?.id}`,
  );

  const message = messageDraft ? (
    <>
      <span className="text-blue-500 text-xs font-semibold">Draft</span>
      {" · "}
      <span className="text-xs">{messageDraft}</span>
    </>
  ) : isDeleted ? (
    `${lastMessageOwnerId === authUser?.id ? "You" : (user?.name ?? "Anonymous")} deleted a message`
  ) : (
    formatRecentMessages(lastMessage, 4, 4)
  );

  const saveOnClick = (userId: string) => () => {
    localStorage.setItem(
      `private-${userId}-${authUser?.id}`,
      formInput?.content,
    );
  };

  const handleRemoveSearchTerm = (userId: string) => () => {
    setSearchTerm("");
    saveOnClick(userId)();
  };

  return (
    <Link
      href={`/chats/${user?.id}`}
      onClick={
        searchTerm
          ? handleRemoveSearchTerm(userIdITyped)
          : saveOnClick(userIdITyped)
      }
    >
      <div
        className={`flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-xl cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
      >
        <div className="shrink-0">
          <Image
            avatar={user?.profile_pictures[0]?.avatar}
            alt={user?.name || "Anonymous"}
            width={11}
            height={11}
          />
        </div>
        <div className="flex-1 min-w-0 hidden md:block">
          <div className="flex items-center justify-between gap-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || "Anonymous"}
            </p>
            {timeSent && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                {dateFormat(timeSent)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {isAttached ? (
                <>
                  <i className="fa-solid fa-paperclip text-[10px] mr-1"></i>
                  Attachment
                </>
              ) : (
                message
              )}
            </p>
            {unreadMessages > 0 && (
              <span className="text-[10px] font-bold text-white bg-blue-500 min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shrink-0">
                {unreadMessages < 10 ? unreadMessages : "9+"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
