import Link from "next/link";
import dateWithTime from "../utils/dateWithTime";

export default function MessageBody({ isIcon, timeSent, message, link }: any) {
  return (
    <div className="flex justify-end group">
      <div className="justify-center flex mr-1 items-center">
        <div className="group-hover:block hidden">
          <button className="px-3.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full">
            <i className="far fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className={`${
            !isIcon && "dark:bg-blue-400/50 bg-blue-400/80 shadow-md"
          } text-white p-3 ${
            link
              ? "rounded-t-2xl w-[200px] md:w-72"
              : "rounded-2xl xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:mx-w-xl lg:max-w-2xl max-w-[230px]"
          }`}
          title={timeSent && dateWithTime(timeSent)}
        >
          <p className="text-sm whitespace-break-spaces break-words">
            {message}
          </p>
        </div>
        {link && (
          <Link className="" href={link.url} target="_blank">
            <div className="border rounded-b-xl border-gray-300/80 shadow-md dark:border-gray-600/80 bg-gray-700/10 dark:bg-gray-200/10 hover:dark:bg-gray-200/20 hover:bg-gray-700/20">
              {link?.images?.length > 0 && (
                <img
                  src={link.images[0]}
                  alt={link.title}
                  className="w-[200px] md:w-72 h-40 object-contain rounded-md"
                />
              )}
              <div className="w-[200px] md:w-72 flex flex-col border-t bg-gray-100 dark:bg-gray-900/20">
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
