import { useAuth } from "@/app/context/AuthContext";
import formatMessages from "../utils/formatMessages";
import Image from "./images/Image";

export default function IsDeletedMessage({
  bubbleClass,
  isLast,
  isFirst,
  avatar,
  name,
  isOwner,
  parent,
  handleScrollToChat,
  senderId,
}: any) {
  const { user }: any = useAuth();
  const unsentMessageRadius = isOwner
    ? `${
        isLast
          ? "rounded-l-3xl rounded-tr-sm rounded-br-3xl"
          : isFirst
          ? "rounded-l-3xl rounded-tr-3xl rounded-br-sm"
          : "rounded-l-3xl"
      }`
    : `${
        isLast
          ? "rounded-r-3xl rounded-tl-sm rounded-bl-3xl"
          : isFirst
          ? "rounded-r-3xl rounded-tl-3xl rounded-bl-sm"
          : "rounded-r-3xl"
      }`;
  return (
    <div className="flex flex-col">
      {parent && (
        <div className="flex py-2 flex-col -mb-5">
          {isOwner ? (
            <>
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
                {parent?.attachment
                  ? "Attachment"
                  : formatMessages(parent?.content, 14, 14)}
              </button>
            </>
          ) : (
            <>
              <div className="text-sm ml-12">
                <i className="far fa-reply"></i> {name ?? "Anonymous"} replied
                to{" "}
                {parent?.userId === user?.id
                  ? "you"
                  : senderId === parent?.userId
                  ? "themself"
                  : parent?.sentBy?.name ?? "Anonymous"}
              </div>
              <button
                type="button"
                onClick={handleScrollToChat}
                className={`px-2 pt-2 pb-4 rounded-xl xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-3xl max-w-[230px] w-fit whitespace-break-spaces break-words text-start ml-12 ${
                  parent?.content !== "(y)" && "bg-black/20"
                }`}
              >
                {parent?.attachment
                  ? "Attachment"
                  : formatMessages(parent?.content, 14, 14)}
              </button>
            </>
          )}
        </div>
      )}
      <div className={`flex gap-2 ${isOwner && "justify-end"}`}>
        {!isOwner && (
          <div
            className={`flex flex-col justify-end ${!isLast && "opacity-0"}`}
          >
            <Image
              avatar={avatar}
              alt={name}
              width={10}
              height={10}
              title={name}
            />
          </div>
        )}
        <div
          className={`text-gray-500 dark:text-gray-800 p-3 ${
            isOwner ? "dark:bg-blue-400/50 bg-blue-400/80" : "bg-gray-500/65"
          } shadow-md text-sm italic ${
            bubbleClass
              ? bubbleClass
              : `${unsentMessageRadius} xl:max-w-3xl 3xl:max-w-7xl sm:max-w-lg md:mx-w-xl lg:max-w-3xl max-w-[230px]`
          }`}
        >
          {`${isOwner ? "You" : name ?? "Anonymous"} unsent a message`}
        </div>
      </div>
    </div>
  );
}
