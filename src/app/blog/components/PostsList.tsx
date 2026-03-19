import { useAuth } from "@/app/context/AuthContext";
import { Storage } from "@/app/utils/StorageUtils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dateFormat from "../utils/dateFormat";
import PostButton from "./buttons/PostButton";
import api from "@/app/lib/axiosCall";
import { useRouter } from "next/navigation";
import TextAreaComment from "./inputs/TextAreaComment";
import CommentsList from "./CommentsList";
import Image from "./images/Image";
import ViewPostComments from "./modals/ViewPostComments";

export default function PostsList({ post, setIsRefresh }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState<any>({});
  const [seeMore, setSeeMore] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<any>("");
  const { user }: any = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isViewCommentOpen, setIsViewCommentOpen] = useState(false);
  const [postId, setPostId] = useState<any>(null);
  const router = useRouter();
  const textareaRef = useRef<any>("");
  const modalRef = useRef<any>(null);
  const buttonRef = useRef<any>(null);

  const isLiked = post.likes.some((liker: any) => liker.userId === user?.id);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setIsViewCommentOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post.image.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + post.image.length) % post.image.length
    );
  };

  const imageIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const handleLike = (postId: number) => async () => {
    setIsRefresh(true);
    try {
      await api.post(`/posts/like/${postId}`, {});
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsRefresh(false);
    }
  };

  const handleOpenComment = (postId: number) => async () => {
    setIsCommentOpen((isCommentOpen: any) => ({
      ...isCommentOpen,
      [postId]: true,
    }));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    setIsOpen(true);
  };

  const handleNavigate = () => {
    router.push("/login");
  };

  const handleSubmitComment = (postId: any) => async () => {
    setIsRefresh(true);
    textareaRef.current.focus();
    try {
      const response = await api.post(`/comments/${postId}`, {
        comment,
      });

      if (textareaRef.current && response.status === 201) {
        textareaRef.current.style.height = "auto";
        setComment("");
        setError("");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
    } finally {
      setIsRefresh(false);
    }
  };

  const handleKeyDown = (postId: any) => (e: any) => {
    if (window.innerWidth > 640) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (comment) {
          handleSubmitComment(postId)();
        }
      }
    }
  };

  const handleInputChange = (e: any) => {
    setComment(e.target.value);
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    if (textareaRef.current.scrollHeight > 200) {
      textareaRef.current.style.overflowY = "auto";
    } else {
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleViewComment = (postId: number) => () => {
    setPostId(postId);
    setIsViewCommentOpen(!isViewCommentOpen);
  };

  const handleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  return (
    <div className="mb-5">
      <div
        className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
        data-aos="fade-up"
      >
        <div className="bg-blue-500 text-white px-4 py-2 rounded-t-md text-center text-sm font-semibold uppercase tracking-wide">
          <Link
            className="hover:underline"
            href={`/blog/posts/${post.category.slug}`}
          >
            {post.category.categoryName}
          </Link>
        </div>

        <div className="shadow-sm p-2">
          {post.image.length !== 0 && (
            <>
              <div className="relative w-full h-auto overflow-hidden rounded-lg">
                <div
                  className="w-full h-full flex transition-transform duration-300"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {post.image.map((image: any, index: number) => (
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

                {post.image.length > 1 && (
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

              {post.image.length > 1 && (
                <div className="flex justify-center mt-2">
                  {post.image.map((_: any, index: any) => (
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
            } text-gray-700 dark:text-gray-300 whitespace-break-spaces break-words`}
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
              <i className="fa-solid fa-microphone-stand text-xs"></i> Author
            </span>
            <span className="px-2 pb-2 pt-8 bg-gray-100 text-gray-900 dark:text-gray-200 min-w-24 dark:bg-gray-700 rounded-lg font-bold">
              {post?.user ? (
                <Link
                  href={`/${post?.user?.username}`}
                  className="text-xs flex gap-1 items-center"
                >
                  <Image
                    avatar={post?.user?.profile_pictures[0]?.avatar}
                    alt={post?.user?.name}
                    h={5}
                    w={5}
                  />{" "}
                  <span className="truncate" title={post?.user?.name}>
                    {post?.user?.id === user?.id
                      ? "You"
                      : post?.user === null
                      ? "Deleted User"
                      : post?.user?.name === null
                      ? "Anonymous"
                      : post?.user?.name}
                  </span>
                </Link>
              ) : (
                <span className="text-xs flex gap-1 items-center">
                  <Image
                    avatar={post?.user?.profile_pictures[0]?.avatar}
                    alt={post?.user?.name}
                    h={5}
                    w={5}
                  />{" "}
                  <span className="truncate" title={post?.user?.name}>
                    {post?.user?.id === user?.id
                      ? "You"
                      : post?.user === null
                      ? "Deleted User"
                      : post?.user?.name === null
                      ? "Anonymous"
                      : post?.user?.name}
                  </span>
                </span>
              )}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
            <span>
              {post.publishedAs === "public" ? (
                <>
                  <i className="fa-solid fa-earth-americas"></i>
                </>
              ) : post.publishedAs === "private" ? (
                <>
                  <i className="fa-solid fa-lock"></i>
                </>
              ) : post.publishedAs === "friends" ? (
                <>
                  <i className="fa-solid fa-user-group"></i>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-signs-posts"></i>
                </>
              )}{" "}
              •{" "}
              <small title={dateFormat(post.createdAt)}>
                {dateFormat(post.createdAt)}
              </small>
            </span>
          </div>
        </div>
        {(post.likes.length || post.comments.length) > 0 && (
          <div className="flex justify-between text-center p-2 border-t border-gray-200 dark:border-gray-700">
            <div className="cursor-pointer flex gap-2 items-center">
              {post.likes.length > 0 && (
                <>
                  <i className="fa-solid fa-thumbs-up text-blue-500"></i>
                  <span>{post.likes.length}</span>
                </>
              )}
              <div className="flex gap-1 items-center">
                {post.likes.length > 0 &&
                  post.likes
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
                      <Link key={index} href={`/${liker?.user?.username}`} className="truncate sm:max-w-full max-w-[100px]">
                        <span
                          title={liker.user.name}
                        >
                          {liker.userId === user?.id
                            ? `You${post.likes.length > 1 ? "," : ""}`
                            : liker.user.name === null
                            ? "Anonymous"
                            : `${liker.user.name}`}
                        </span>
                      </Link>
                    ))}
                {post.likes.length - (isLiked ? 1 : 0) > 1 && (
                  <span className="sm:max-w-full max-w-[100px] relative group hover:underline cursor-pointer">
                    and others
                    <div className="hidden group-hover:block absolute w-auto max-h-[300px] overflow-y-auto  min-w-60 rounded-lg z-50 text-start text-sm text-gray-100 dark:bg-black/75 bg-black/50 px-4 py-2 left-0 bottom-full">
                      <ul>
                        {post.likes
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
                            <li key={index}>
                              <Link href={`/${liker?.user?.username}`}>
                                {liker.user.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative group">
                <button
                  type="button"
                  onClick={user ? handleViewComment(post.id) : handleNavigate}
                  ref={buttonRef}
                >
                  {post.comments.length > 0 && (
                    <span className="hover:border-b border-gray-600 dark:border-gray-300">
                      <i className="fa-solid fa-comment"></i>
                      <span className="ml-1">
                        {post.comments.length}{" "}
                        {post.comments.length === 1 ? "comment" : "comments"}
                      </span>
                    </span>
                  )}
                </button>
                <div className="hidden group-hover:block absolute max-h-[300px] overflow-y-auto w-auto min-w-60 rounded-lg z-50 text-start text-sm text-gray-100 dark:bg-black/75 bg-black/50 px-4 py-2 right-0 bottom-full">
                  <ul>
                    {post.comments
                      .filter(
                        (value: any, index: any, self: any) =>
                          index ===
                          self.findIndex(
                            (comment: any) => comment.userId === value.userId
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
                          {commenter?.user ? (
                            <Link href={`/${commenter?.user?.username}`}>
                              {commenter?.userId === user?.id
                                ? "You"
                                : commenter?.user?.name === null
                                ? "Anonymous"
                                : commenter?.user === null
                                ? "Deleted User"
                                : commenter?.user?.name}
                            </Link>
                          ) : commenter?.userId === user?.id ? (
                            "You"
                          ) : commenter?.user?.name === null ? (
                            "Anonymous"
                          ) : commenter?.user === null ? (
                            "Deleted User"
                          ) : (
                            commenter?.user?.name
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <button type="button">
                <span className="hover:border-b border-gray-600 dark:border-gray-300">
                  <i className="fa-solid fa-share"></i>{" "}
                  <span className="ml-1">10</span>
                </span>
              </button>
            </div>
          </div>
        )}
        <div className="border-t flex justify-between items-center border-gray-200 dark:border-gray-700 py-1">
          <PostButton
            type="button"
            onClick={user ? handleLike(post.id) : handleNavigate}
            icon="thumbs-up"
            label="Like"
            isLiked={isLiked}
          />
          <PostButton
            type="button"
            icon="comment"
            label="Comment"
            onClick={user ? handleOpenComment(post.id) : handleNavigate}
          />
          <PostButton type="button" icon="share" label="Share" />
        </div>
        {(isCommentOpen[post.id] || post.comments.length > 0) && (
          <div className="border-t flex justify-between items-center flex-col gap-2 border-gray-200 dark:border-gray-700 py-5">
            {post.comments.length > 0 &&
              post.comments
                .slice(0, 1)
                .map((comment: any, index: number) => (
                  <CommentsList
                    key={index}
                    comment={comment}
                    author={comment.userId === post.userId}
                    commentOwner={comment.userId === user?.id}
                  />
                ))}
            {(isCommentOpen[post.id] || post.comments.length > 0) && user && (
              <div className="flex gap-2 w-full px-3">
                <Image
                  avatar={user?.profile_pictures[0]?.avatar}
                  alt={user?.name}
                  h={8}
                  w={8}
                />
                <div className="w-full px-3 pt-2 dark:bg-gray-700 bg-gray-200 mx-2 rounded-3xl relative">
                  <TextAreaComment
                    ref={textareaRef}
                    onClick={handleClickOpen}
                    value={comment}
                    error={error.comment?.message}
                    onKeyDown={handleKeyDown(post.id)}
                    onChange={handleInputChange}
                    onInput={handleInput}
                    placeholder={`Comment as ${user?.name}`}
                    rows={1}
                  />
                  {!isOpen && (
                    <div className="absolute top-2 right-3">
                      <i className="fa-solid fa-smile"></i>
                    </div>
                  )}

                  {isOpen && (
                    <div className="flex justify-between pb-2 items-center transition-all duration-300 ease-in-out">
                      <div>
                        <i className="fa-solid fa-smile"></i>
                      </div>
                      <div>
                        <button
                          type="button"
                          disabled={!comment}
                          onClick={
                            comment ? handleSubmitComment(post.id) : undefined
                          }
                          className={`${
                            !comment
                              ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                              : "text-blue-500 dark:text-blue-300 hover:dark:bg-gray-600 hover:bg-gray-300"
                          } rounded-full px-2 py-1`}
                        >
                          <i className="fa-solid fa-paper-plane-top"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ViewPostComments
        modalRef={modalRef}
        isOpen={isViewCommentOpen}
        onClose={handleViewComment(post.id)}
        postId={postId}
        setIsRefresh={setIsRefresh}
      />
    </div>
  );
}
