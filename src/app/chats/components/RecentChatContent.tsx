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
}: any) {
  const { user: authUser }: any = useAuth();
  const messageDraft = localStorage.getItem(
    `private-${user?.id}-${authUser?.id}`
  );
  const message = messageDraft ? (
    <>
      <span className="text-blue-400 text-xs">Draft</span>{" "}
      <span className="text-xs">•</span>{" "}
      <span className="text-xs">{messageDraft}</span>
    </>
  ) : isDeleted ? (
    `${
      lastMessageOwnerId === authUser?.id ? "You" : user?.name ?? "Anonymous"
    } deleted a message`
  ) : (
    formatRecentMessages(lastMessage, 4, 4)
  );

  const saveOnClick = (userId: string) => () => {
    localStorage.setItem(
      `private-${userId}-${authUser?.id}`,
      formInput?.content
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
        className={`flex items-center mt-2 p-2 rounded-lg cursor-pointer hover:dark:bg-gray-600 hover:bg-gray-100 md:mx-3 relative ${
          isActive && "bg-gray-100 dark:bg-gray-600"
        }`}
      >
        <Image
          avatar={user?.profile_pictures[0]?.avatar}
          alt={user?.name || "Anonymous"}
          width={14}
          height={14}
        />
        <div className="ml-3 hidden md:block">
          <p className="text-md font-semibold truncate max-w-44">
            {user?.name || "Anonymous"}
          </p>
          <div className="flex gap-1 max-w-44">
            <div className="text-gray-500 dark:text-gray-100 sm:max-w-40">
              <p className="text-xs truncate">{message}</p>
            </div>
            {timeSent && (
              <span className="text-xs">
                •<span className="ml-1 text-xs">{dateFormat(timeSent)}</span>
              </span>
            )}
          </div>
        </div>
        <div className="absolute right-1">
          {unreadMessages > 0 && (
            <span className="text-[10px] text-white bg-blue-500 px-1.5 py-0.5 rounded-full">
              {unreadMessages < 9 ? unreadMessages : "9+"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
