import Image from "./images/Image";

export default function IsDeletedMessage({
  bubbleClass,
  isLast,
  isFirst,
  avatar,
  name,
  isOwner,
}: any) {
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
    <div className={`flex gap-2 ${isOwner && "justify-end"}`}>
      {!isOwner && (
        <div className={`flex flex-col justify-end ${!isLast && "opacity-0"}`}>
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
  );
}
