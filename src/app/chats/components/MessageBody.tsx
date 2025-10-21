import Link from "next/link";
import dateWithTime from "../utils/dateWithTime";

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
}: any) {
  return (
    <div className="flex justify-end group">
      <div className="justify-center flex mr-1 items-center">
        <div
          className={`${
            isOpen[messageId] && "group-first:block"
          } group-hover:block hidden relative`}
        >
          <button
            className="px-3.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full"
            type="button"
            onClick={handleOpen(messageId)}
            ref={buttonRef}
          >
            <i className="far fa-ellipsis-vertical"></i>
          </button>
          {isOpen[messageId] && (
            <div
              ref={dropdownRef}
              className="absolute bottom-7 right-4 bg-gray-100 dark:bg-gray-800 rounded-xl w-[150px] text-xs z-[999999]"
            >
              <ul>
                {message[0]?.props?.children?.props?.src !==
                  "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png" && (
                  <li className="hover:bg-gray-200 dark:hover:bg-gray-900 p-5 rounded-xl">
                    <button
                      type="button"
                      className="w-full text-start"
                      onClick={handleOpenModal(messageId, "edit")}
                    >
                      <i className="far fa-pen"></i> Edit
                    </button>
                  </li>
                )}
                <li className="hover:bg-gray-200 dark:hover:bg-gray-900 p-5 rounded-xl">
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
      <div className="flex flex-col">
        <div
          className={`${
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
          } xl:max-w-3xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px]`}
          title={timeSent && dateWithTime(timeSent)}
        >
          <p className="text-sm whitespace-break-spaces break-words">
            {message}
          </p>
        </div>
        {link && (
          <Link className="w-[200px] md:w-72" href={link.url} target="_blank">
            <div className="border rounded-b-xl border-gray-300/80 shadow-md dark:border-gray-600/80 bg-gray-700/10 dark:bg-gray-200/10 hover:dark:bg-gray-200/20 hover:bg-gray-700/20">
              {link?.images?.length > 0 && (
                <img
                  src={link.images[0]}
                  alt={link.title}
                  className="w-full h-40 object-contain rounded-md"
                />
              )}
              <div className="w-full flex flex-col border-t rounded-b-3xl bg-gray-100 dark:bg-gray-900/20">
                <span
                  className="p-2 text-md font-bold truncate"
                  title={link.title === "Error" ? link.url : link.title}
                >
                  {link.title === "Error" ? link.url : link.title}
                </span>
                <span
                  className="p-2 text-sm font-semi-bold truncate"
                  title={link.url}
                >
                  {link.url}
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
      </div>
    </div>
  );
}
