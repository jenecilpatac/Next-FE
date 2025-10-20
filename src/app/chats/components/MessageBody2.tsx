import Link from "next/link";
import dateWithTime from "../utils/dateWithTime";
import Image from "./images/Image";

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
}: any) {
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
            <div
              className={`${
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
                    } xl:max-w-4xl 3xl:max-w-7xl sm:max-w-lg md:mx-w-xl lg:max-w-3xl max-w-[230px]`
              }`}
              title={timeSent && dateWithTime(timeSent)}
            >
              <p className="text-sm whitespace-break-spaces break-words">
                {message}
              </p>
            </div>
            {link && (
              <Link
                className="w-[200px] md:w-72"
                href={link.url}
                target="_blank"
              >
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
          <div className="justify-center flex ml-1 items-center">
            <div className="group-hover:block hidden">
              <button
                type="button"
                className="px-3.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full"
              >
                <i className="far fa-ellipsis-vertical"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
