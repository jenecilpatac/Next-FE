import { Storage } from "@/app/utils/StorageUtils";
import Link from "next/link";
import { useState } from "react";
import dateFormat from "../utils/dateFormat";
import PostButton from "./buttons/PostButton";
import api from "@/app/lib/axiosCall";
import { useRouter } from "next/navigation";
import CommentsList from "./CommentsList";
import Image from "./images/Image";

export default function SinglePost({
  post,
  setIsRefresh,
  setIsRefreshData,
  user,
  commentRef,
}: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const router = useRouter();

  const isLiked = post?.likes?.some((liker: any) => liker.userId === user?.id);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post?.image.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + post?.image.length) % post?.image.length
    );
  };

  const imageIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const handleLike = (postId: number) => async () => {
    setIsRefresh(true);
    setIsRefreshData(true);
    try {
      await api.post(`/posts/like/${postId}`, {});
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsRefresh(false);
      setIsRefreshData(false);
    }
  };

  const handleNavigate = () => {
    router.push("/login");
  };

  const handleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  return (
    <div className="mb-5">
      <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
        <div className="bg-blue-500 text-white px-4 py-2 rounded-t-md text-center text-sm font-semibold uppercase tracking-wide">
          <Link
            className="hover:underline"
            href={`/blog/posts/${post?.category?.slug}`}
          >
            {post?.category?.categoryName}
          </Link>
        </div>

        <div className="shadow-sm p-2">
          {post?.image.length !== 0 && (
            <>
              <div className="relative w-full h-[450px] overflow-hidden rounded-lg">
                <div
                  className="w-full h-full flex transition-transform duration-300"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {post?.image.map((image: any, index: number) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-full h-full relative"
                    >
                      <img
                        className="w-full h-full object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                        src={Storage(image)}
                        alt={`Post Image ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                {post?.image.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 dark:bg-black dark:bg-opacity-50 p-2 bg-gray-200 rounded hover:bg-opacity-75"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 dark:bg-black dark:bg-opacity-50 p-2 bg-gray-200 rounded hover:bg-opacity-75"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>

              {post?.image.length > 1 && (
                <div className="flex justify-center mt-2">
                  {post?.image.map((_: any, index: any) => (
                    <div
                      onClick={() => imageIndex(index)}
                      key={index}
                      className={`w-2.5 h-2.5 mx-1 rounded-full cursor-pointer hover:bg-blue-500 ${
                        currentIndex === index ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-4 py-2">
          <p
            className={`${
              post.description.length < 100
                ? "text-4xl font-bold"
                : post.description.length > 150 && !seeMore
                ? "line-clamp-[10] text-md"
                : "text-md"
            } text-gray-700 dark:text-gray-300 break-words whitespace-break-spaces`}
          >
            {post.description.trim()}
          </p>
          {post.description.length > 150 && !seeMore && (
            <button
              onClick={handleSeeMore}
              type="button"
              className="text-gray-400 font-bold hover:underline dark:text-gray-500"
            >
              See more...
            </button>
          )}
        </div>

        <div className="p-3 flex justify-between gap-2 items-center border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-900 dark:text-gray-300 flex items-center relative">
            <span className="absolute top-1 font-bold left-2 px-2 py-1 rounded-md text-xs bg-gray-300 text-gray-700 dark:text-gray-100 dark:bg-gray-600">
              <i className="fa-solid fa-microphone-stand text-xs"></i>{" "}
              Author
            </span>
            <span className="px-2 pb-2 pt-8 bg-gray-100 text-gray-900 dark:text-gray-200 min-w-24 dark:bg-gray-700 rounded-lg font-bold text-xs flex gap-1 items-center">
              <Image
                avatar={post?.user?.profile_pictures[0]?.avatar}
                alt={post?.user?.name}
                h={5}
                w={5}
              />{" "}
              <span className="truncate" title={post?.user?.name}>
                {post?.user?.name === user?.name
                  ? "You"
                  : post?.user === null
                  ? "Deleted User"
                  : post?.user?.name === null
                  ? "Anonymous"
                  : post?.user?.name}
              </span>
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
            <span>
              {post?.publishedAs === "public" ? (
                <>
                  <i className="fa-solid fa-earth-americas"></i>
                </>
              ) : post?.publishedAs === "private" ? (
                <>
                  <i className="fa-solid fa-lock"></i>
                </>
              ) : post?.publishedAs === "friends" ? (
                <>
                  <i className="fa-solid fa-user-group"></i>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-signs-posts"></i>
                </>
              )}{" "}
              •{" "}
              <small title={dateFormat(post?.createdAt)}>
                {dateFormat(post?.createdAt)}
              </small>
            </span>
          </div>
        </div>
        {(post?.likes.length || post?.comments.length) > 0 && (
          <div className="flex justify-between text-center p-2 border-t border-gray-200 dark:border-gray-700">
            <div className="cursor-pointer flex gap-2 items-center">
              {post?.likes.length > 0 && (
                <>
                  <i className="fa-solid fa-thumbs-up text-blue-500"></i>
                  <span>{post?.likes.length}</span>
                </>
              )}
              <div className="flex gap-1 items-center">
                {post?.likes.length > 0 &&
                  post?.likes
                    .sort((a: any, b: any) => {
                      if (a.userId === user?.id) {
                        return -1;
                      }
                      if (b.userId === user?.id) {
                        return 1;
                      }
                      return 0;
                    })
                    .slice(0, isLiked ? 2 : 1)
                    .map((liker: any, index: number) => (
                      <span
                        key={index}
                        className="truncate sm:max-w-full max-w-[100px]"
                        title={liker.user.name}
                      >
                        {liker.userId === user?.id
                          ? `You${post?.likes.length > 1 ? "," : ""}`
                          : liker.user.name === null
                          ? "Anonymous"
                          : `${liker.user.name}`}
                      </span>
                    ))}
                {post?.likes.length - (isLiked ? 1 : 0) > 1 && (
                  <span className="sm:max-w-full max-w-[100px] relative group hover:underline cursor-pointer">
                    and others
                    <div className="hidden group-hover:block absolute max-h-[300px] overflow-y-auto w-auto min-w-60 rounded-lg z-50 text-start text-sm text-gray-100 dark:bg-black/75 bg-black/50 px-4 py-2 left-0 bottom-full">
                      <ul>
                        {post?.likes
                          .sort((a: any, b: any) => {
                            if (a.userId === user?.id) {
                              return -1;
                            }
                            if (b.userId === user?.id) {
                              return 1;
                            }
                            return 0;
                          })
                          .slice(isLiked ? 2 : 1)
                          .map((liker: any, index: number) => (
                            <li key={index}>{liker.user.name}</li>
                          ))}
                      </ul>
                    </div>
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button">
                {post?.comments.length > 0 && (
                  <span className="hover:border-b relative group border-gray-600 dark:border-gray-300">
                    <i className="fa-solid fa-comment"></i>
                    <span className="ml-1">
                      {post?.comments.length}{" "}
                      {post?.comments.length === 1 ? "comment" : "comments"}
                    </span>
                    <div className="hidden group-hover:block absolute max-h-[300px] overflow-y-auto w-auto min-w-60 rounded-lg z-50 text-start text-sm text-gray-100 dark:bg-black/75 bg-black/50 px-4 py-2 right-0 bottom-full">
                      <ul>
                        {post?.comments
                          .filter(
                            (value: any, index: any, self: any) =>
                              index ===
                              self.findIndex(
                                (comment: any) =>
                                  comment.userId === value.userId
                              )
                          )
                          .sort((a: any, b: any) => {
                            if (a.userId === user?.id) {
                              return -1;
                            }
                            if (b.userId === user?.id) {
                              return 1;
                            }
                            return 0;
                          })
                          .map((commenter: any, index: number) => (
                            <li key={index}>
                              {commenter?.userId === user?.id
                                ? "You"
                                : commenter?.user?.name === null
                                ? "Anonymous"
                                : commenter?.user === null
                                ? "Deleted User"
                                : commenter?.user?.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </span>
                )}
              </button>
              <button type="button">
                <span className="hover:border-b border-gray-600 dark:border-gray-300">
                  <i className="fa-solid fa-share"></i>{" "}
                  <span className="ml-1">10</span>
                </span>
              </button>
            </div>
          </div>
        )}
        <div
          ref={commentRef}
          className="border-t flex justify-between items-center border-gray-200 dark:border-gray-700 py-1"
        >
          <PostButton
            type="button"
            onClick={user ? handleLike(post?.id) : handleNavigate}
            icon="thumbs-up"
            label="Like"
            isLiked={isLiked}
          />
          <PostButton type="button" icon="comment" label="Comment" />
          <PostButton type="button" icon="share" label="Share" />
        </div>
        {post?.comments.length > 0 && (
          <div className="border-t flex justify-between items-center flex-col gap-2 border-gray-200 dark:border-gray-700 py-5">
            {post?.comments.length > 0 &&
              post?.comments.map((comment: any, index: number) => (
                <CommentsList
                  key={index}
                  comment={comment}
                  author={comment.userId === post?.userId}
                  commentOwner={comment.userId === user?.id}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
