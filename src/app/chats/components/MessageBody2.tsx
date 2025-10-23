import Link from "next/link";
import dateWithTime from "../utils/dateWithTime";
import Image from "./images/Image";
import { useAuth } from "@/app/context/AuthContext";
import formatMessages from "../utils/formatMessages";

export default function MessageBody2({
  avatar,
  name,
  isPublic,
  isIcon,
  timeSent,
  message,
  link,
  isLast,
  isFirst,
  bubbleClass,
  messageId,
  handleOpenReactions,
  groupedReactions,
  handleOpenUsersReactions,
  buttonRef,
  dropdownRef,
  isOpen,
  handleOpen,
  handleIsReplying,
  parent,
  senderId,
  handleScrollToChat,
}: any) {
  const { user }: any = useAuth();
  return (
    <div className="flex justify-start gap-2 group">
      <div className={`flex flex-col justify-end ${!isLast && "opacity-0"}`}>
        <Image avatar={avatar} alt={name} width={10} height={10} title={name} />
      </div>
      <div>
        {isPublic && (
          <p className={`text-sm font-semibold ${!isFirst && "hidden"}`}>
            {name ?? "Anonymous"}
          </p>
        )}
        <div className="flex">
          <div className="flex flex-col">
            {parent && (
              <div className="flex py-2 flex-col -mb-5">
                <div className="text-sm">
                  <i className="far fa-reply"></i> {name ?? "Anonymous"} replied
                  to{" "}
                  {parent?.userId === user?.id
                    ? "you"
                    : senderId === parent?.userId
                    ? "him/her self"
                    : parent?.sentBy?.name ?? "Anonymous"}
                </div>
                <button
                  type="button"
                  onClick={handleScrollToChat}
                  className={`px-2 pt-2 pb-4 rounded-xl xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px] w-fit whitespace-break-spaces break-words text-start ${
                    parent?.content !== "(y)" && "bg-black/20"
                  }`}
                >
                  {formatMessages(parent?.content, 14, 14)}
                </button>
              </div>
            )}
            <div
              id={messageId}
              className={`transition-all duration-300 ease-in-out ${
                !isIcon && "bg-gray-500/65 shadow-md"
              } text-white p-3 ${
                link
                  ? "rounded-t-3xl w-[200px] md:w-72"
                  : bubbleClass
                  ? bubbleClass
                  : `${
                      isLast
                        ? "rounded-r-3xl rounded-tl-sm rounded-bl-3xl"
                        : isFirst
                        ? "rounded-r-3xl rounded-tl-3xl rounded-bl-sm"
                        : "rounded-r-3xl rounded-l-sm"
                    }`
              } xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px] w-fit`}
              title={timeSent && dateWithTime(timeSent)}
            >
              <p className="text-sm whitespace-break-spaces break-words">
                {message}
              </p>
            </div>
            {link && (
              <Link
                className="w-[230px] md:w-72"
                href={link.url}
                target="_blank"
              >
                <div className="border rounded-b-xl border-gray-300/80 shadow-md dark:border-gray-600/80 bg-gray-700/10 dark:bg-gray-200/10 hover:dark:bg-gray-200/20 hover:bg-gray-700/20">
                  <img
                    src={link?.images?.length > 0 ? link?.images[0] : link?.url}
                    alt={link.title}
                    className="w-full h-40 object-contain rounded-md"
                  />
                  <div className="w-full flex flex-col border-t rounded-b-3xl bg-gray-100 dark:bg-gray-900/20">
                    <span
                      className="p-2 text-md font-bold truncate"
                      title={link.title === "Error" ? link.url : link.title}
                    >
                      {link.title === "Error" ? link.url : link.title}
                    </span>
                    <span
                      className="p-2 text-xs font-thin truncate"
                      title={link.description}
                    >
                      {link.description}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {groupedReactions?.length > 0 && (
              <div className="rounded-2xl bg-gray-700 text-white dark:border dark:border-gray-400 xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px] w-fit -mt-2">
                <div className="flex flex-wrap">
                  {groupedReactions?.map(
                    (
                      { label, users }: { label: any; users: any },
                      index: number
                    ) => (
                      <button
                        type="button"
                        key={index}
                        className="relative flex gap-1 items-center hover:scale-125 transition-all duration-300 ease-in-out"
                        onClick={handleOpenUsersReactions(messageId)}
                        title={users
                          ?.map((us: any) =>
                            us?.id === user?.id
                              ? "You"
                              : us?.name ?? "Anonymous"
                          )
                          ?.join("\n")}
                      >
                        <span className="text-md">{label}</span>
                        {users?.length > 1 && (
                          <span className="text-md">{users?.length}</span>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="justify-center flex ml-1 items-center">
            <div
              className={`${
                isOpen[messageId] && "group-first:block"
              } group-hover:block hidden relative`}
            >
              <button
                type="button"
                className="px-3.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full"
                onClick={handleOpen(messageId)}
                ref={buttonRef}
              >
                <i className="far fa-ellipsis-vertical"></i>
              </button>
              <button
                type="button"
                className="px-3.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full"
                onClick={handleOpenReactions(messageId)}
              >
                <i className="far fa-smile"></i>
              </button>
              {isOpen[messageId] && (
                <div
                  ref={dropdownRef}
                  className="absolute bottom-7 left-4 bg-gray-100 dark:bg-gray-800 rounded-xl w-[150px] text-xs z-[999999]"
                >
                  <ul>
                    <li className="hover:bg-gray-200 dark:hover:bg-gray-900 p-5 rounded-xl w-full">
                      <button
                        onClick={handleIsReplying}
                        type="button"
                        className="w-full text-start"
                      >
                        <i className="far fa-reply"></i> Reply
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
