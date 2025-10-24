import Link from "next/link";
import dateWithTime from "../utils/dateWithTime";
import { useAuth } from "@/app/context/AuthContext";
import formatMessages from "../utils/formatMessages";
import { useEffect, useRef, useState } from "react";

export default function MessageBody({
  isIcon,
  timeSent,
  message,
  link,
  isLast,
  isFirst,
  bubbleClass,
  handleOpen,
  isOpen,
  messageId,
  buttonRef,
  dropdownRef,
  handleOpenModal,
  handleOpenReactions,
  groupedReactions,
  handleOpenUsersReactions,
  handleIsReplying,
  parent,
  handleScrollToChat,
}: any) {
  const { user }: any = useAuth();
  const touchRef = useRef(false);
  const [timer, setTimer] = useState<any>(null);
  const [swipe, setSwipe] = useState<number>(1);
  const [isSwiped, setIsSwiped] = useState<boolean>(false);

  useEffect(() => {
    if (swipe <= 0 && !isSwiped) {
      handleIsReplying();
    }
  }, [swipe, isSwiped]);

  const handleTouchStart = () => {
    setSwipe(1);
    touchRef.current = false;
    const time = setTimeout(() => {
      if (swipe > 1) return;
      touchRef.current = true;
    }, 400);

    setTimer(time);
  };

  const handleTouchEnd = (e: any) => {
    e.preventDefault();
    if (timer) clearTimeout(timer);

    if (touchRef.current) {
      setSwipe(1);
      handleOpenReactions(messageId)();
    }

    if (isSwiped) {
      setSwipe(0);
      setIsSwiped(false);
    }
  };

  const handleTouchMove = (e: any) => {
    const { clientX } = e.touches[0];
    setSwipe(clientX);
    setIsSwiped(true);

    if (Math.abs(clientX) > 10) {
      if (timer) clearTimeout(timer);
      touchRef.current = false;
    }
  };

  return (
    <div className="flex justify-end group">
      <div className="justify-center flex mr-1 items-center">
        <div
          className={`${
            isOpen[messageId] && "group-first:block"
          } group-hover:md:block hidden relative`}
        >
          <button
            type="button"
            className="px-2.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full"
            onClick={handleOpenReactions(messageId)}
          >
            <i className="far fa-smile"></i>
          </button>
          <button
            onClick={handleIsReplying}
            type="button"
            className="px-2.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full"
          >
            <i className="far fa-reply"></i>
          </button>
          <button
            className="px-2.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full"
            type="button"
            onClick={handleOpen(messageId)}
            ref={buttonRef}
          >
            <i className="far fa-ellipsis-vertical"></i>
          </button>
          {isOpen[messageId] && (
            <div
              ref={dropdownRef}
              className="absolute bottom-9 md:right-4 right-0 bg-gray-100 dark:bg-gray-800 rounded-xl w-[150px] text-xs z-[999999]"
            >
              <ul>
                {message[0]?.props?.children?.props?.src !==
                  "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png" && (
                  <li className="hover:bg-gray-200 dark:hover:bg-gray-900 p-5 rounded-xl w-full">
                    <button
                      type="button"
                      className="w-full text-start"
                      onClick={handleOpenModal(messageId, "edit")}
                    >
                      <i className="far fa-pen"></i> Edit
                    </button>
                  </li>
                )}
                <li className="hover:bg-gray-200 dark:hover:bg-gray-900 p-5 rounded-xl w-full">
                  <button
                    type="button"
                    className="w-full text-start"
                    onClick={handleOpenModal(messageId, "delete")}
                  >
                    <i className="far fa-trash"></i> Unsend
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col transition-all duration-200 ease-in-out ${
          isSwiped && "mr-14"
        }`}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {parent && (
          <div className="flex py-2 flex-col -mb-5">
            <div className="text-sm self-end">
              <i className="far fa-reply"></i> You replied to{" "}
              {parent?.userId === user?.id
                ? "Yourself"
                : parent?.sentBy?.name ?? "Anonymous"}
            </div>
            <button
              type="button"
              onClick={handleScrollToChat}
              className={`px-2 pt-2 pb-4 rounded-xl xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px] w-fit self-end whitespace-break-spaces break-words text-start ${
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
            !isIcon && "dark:bg-blue-400/50 bg-blue-400/80 shadow-md"
          } text-white p-3 ${
            link
              ? "rounded-t-3xl w-[200px] md:w-72"
              : bubbleClass
              ? bubbleClass
              : `${
                  isLast
                    ? "rounded-l-3xl rounded-tr-sm rounded-br-3xl"
                    : isFirst
                    ? "rounded-l-3xl rounded-tr-3xl rounded-br-sm"
                    : "rounded-l-3xl rounded-r-sm"
                }`
          } xl:max-w-3xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px] w-fit self-end`}
          title={timeSent && dateWithTime(timeSent)}
        >
          <p className="text-sm whitespace-break-spaces break-words">
            {message}
          </p>
        </div>
        {link && (
          <Link className="w-[230px] md:w-72" href={link.url} target="_blank">
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
          <div className="rounded-2xl bg-gray-700 text-white dark:border dark:border-gray-400 xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px] w-fit -mt-2 self-end">
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
                        us?.id === user?.id ? "You" : us?.name ?? "Anonymous"
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
    </div>
  );
}
