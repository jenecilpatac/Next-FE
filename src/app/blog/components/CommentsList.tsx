import { useState } from "react";
import Image from "./images/Image";
import commentDateFormat from "../utils/commentDateFormat";
import dateFormat from "../utils/dateFormat";

export default function CommentsList({ comment, author, commentOwner }: any) {
  const [seeMore, setSeeMore] = useState(false);
  const handleSeeMore = () => {
    if (comment.comment.length > 100) {
      setSeeMore(!seeMore);
    }
  };
  return (
    <div className="flex items-start gap-3 px-3 relative w-full pb-6">
      <Image
        avatar={comment.user?.profile_pictures[0]?.avatar}
        alt={comment.user?.name}
        h={8}
        w={8}
      />
      <div className="rounded-3xl text-gray-900 dark:text-gray-400 dark:bg-gray-700/95 bg-gray-100 px-3 py-2 max-w-[90%]">
        <p className={`text-md font-bold relative text-gray-800 dark:text-gray-300 ${author && "pt-6"}`}>
          {author && (
            <span className="absolute top-0 text-xs bg-gray-300 text-gray-700 dark:text-gray-200 dark:bg-gray-600 px-2 py-1 rounded-lg">
              <i className="fa-solid fa-microphone-stand text-xs"></i> Author
            </span>
          )}
          {comment.user === null ? "Deleted User" : comment.user.name}
        </p>
        <p className="break-words whitespace-break-spaces text-gray-800 dark:text-gray-300">
          <span
            className={`${
              seeMore
                ? comment.comment.length < 100
                : comment.comment.length > 100
                ? "line-clamp-3"
                : ""
            }`}
          >
            {comment.comment}
          </span>
          {seeMore
            ? comment.comment.length < 100
            : comment.comment.length > 100 && (
                <>
                  <button
                    type="button"
                    onClick={handleSeeMore}
                    className="text-sm hover:underline text-gray-500 dark:text-gray-400 font-bold"
                  >
                    See more...
                  </button>
                </>
              )}
        </p>
      </div>
      <div className="absolute -bottom-1 left-[45px]">
        <div className="flex gap-4 text-sm items-center">
          <span
            className="text-gray-500 text-sm dark:text-gray-400 font-semibold hover:underline cursor-pointer"
            title={dateFormat(comment.createdAt)}
          >
            {commentDateFormat(comment.createdAt)}
          </span>
          <button type="button" className="hover:underline">
            Like
          </button>
          <button type="button" className="hover:underline">
            Reply
          </button>
          {commentOwner && (
            <button type="button" className="hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
