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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextImage = () => setCurrentIndex((p) => (p + 1) % post.image.length);
  const prevImage = () =>
    setCurrentIndex((p) => (p - 1 + post.image.length) % post.image.length);
  const imageIndex = (i: number) => setCurrentIndex(i);

  const handleLike = (postId: number) => async () => {
    setIsRefresh(true);
    try {
      await api.post(`/posts/like/${postId}`, {});
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRefresh(false);
    }
  };

  const handleOpenComment = (postId: number) => async () => {
    setIsCommentOpen((p: any) => ({ ...p, [postId]: true }));
    if (textareaRef.current) textareaRef.current.focus();
    setIsOpen(true);
  };

  const handleNavigate = () => router.push("/login");

  const handleSubmitComment = (postId: any) => async () => {
    setIsRefresh(true);
    textareaRef.current.focus();
    try {
      const response = await api.post(`/comments/${postId}`, { comment });
      if (textareaRef.current && response.status === 201) {
        textareaRef.current.style.height = "auto";
        setComment("");
        setError("");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.response.data);
    } finally {
      setIsRefresh(false);
    }
  };

  const handleKeyDown = (postId: any) => (e: any) => {
    if (window.innerWidth > 640 && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (comment) handleSubmitComment(postId)();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > 200 ? "auto" : "hidden";
    }
  };

  const handleViewComment = (postId: number) => () => {
    setPostId(postId);
    setIsViewCommentOpen(!isViewCommentOpen);
  };

  const statusIcon: any = {
    public: "fa-earth-americas",
    private: "fa-lock",
    friends: "fa-user-group",
  };

  return (
    <div className="mb-6">
      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"
        data-aos="fade-up"
      >
        {/* Category Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-center">
          <Link
            href={`/blog/posts/${post.category.slug}`}
            className="text-white text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            {post.category.categoryName}
          </Link>
        </div>

        {/* Author Row */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <Image
            avatar={post?.user?.profile_pictures[0]?.avatar}
            alt={post?.user?.name}
            h={10}
            w={10}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {post?.user ? (
                <Link
                  href={`/${post?.user?.username}`}
                  className="hover:underline"
                >
                  {post?.user?.id === user?.id
                    ? "You"
                    : (post?.user?.name ?? "Anonymous")}
                </Link>
              ) : (
                <span>
                  {post?.user === null ? "Deleted User" : "Anonymous"}
                </span>
              )}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
              <i
                className={`fa-solid ${statusIcon[post.publishedAs] ?? "fa-signs-posts"} text-[10px]`}
              ></i>
              <span>{dateFormat(post.createdAt)}</span>
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-3">
          <p
            className={`text-gray-800 dark:text-gray-200 whitespace-break-spaces break-words leading-relaxed ${post.description.length < 80 ? "text-xl font-bold" : "text-sm"} ${post.description.length > 150 && !seeMore ? "line-clamp-[8]" : ""}`}
          >
            {post.description.trim()}
          </p>
          {post.description.length > 150 && !seeMore && (
            <button
              onClick={() => setSeeMore(true)}
              className="text-xs text-blue-500 hover:underline mt-1 font-medium"
            >
              See more
            </button>
          )}
        </div>

        {/* Images */}
        {post.image.length > 0 && (
          <div className="relative w-full overflow-hidden bg-black">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {post.image.map((image: any, index: number) => (
                <div key={index} className="flex-shrink-0 w-full">
                  <img
                    className="w-full max-h-[420px] object-cover"
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
                  className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.image.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => imageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${currentIndex === i ? "bg-white" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Likes & Comments count row */}
        {(post.likes.length > 0 || post.comments.length > 0) && (
          <div className="flex justify-between items-center px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              {post.likes.length > 0 && (
                <>
                  <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-thumbs-up text-white text-[9px]"></i>
                  </span>
                  <span className="text-xs">{post.likes.length}</span>
                  <div className="flex gap-1 items-center text-xs">
                    {post.likes
                      .sort((a: any, b: any) =>
                        a.userId === user?.id
                          ? -1
                          : b.userId === user?.id
                            ? 1
                            : 0,
                      )
                      .slice(0, isLiked ? 2 : 1)
                      .map((liker: any, i: number) => (
                        <Link
                          key={i}
                          href={`/${liker?.user?.username}`}
                          className="hover:underline truncate max-w-[80px]"
                        >
                          {liker.userId === user?.id
                            ? `You${post.likes.length > 1 ? "," : ""}`
                            : (liker.user.name ?? "Anonymous")}
                        </Link>
                      ))}
                    {post.likes.length - (isLiked ? 1 : 0) > 1 && (
                      <span className="relative group cursor-pointer hover:underline">
                        and others
                        <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 w-48 max-h-60 overflow-y-auto bg-gray-900/90 text-white text-xs rounded-xl px-3 py-2 z-50 shadow-xl">
                          <ul className="space-y-1">
                            {post.likes
                              .sort((a: any, b: any) =>
                                a.userId === user?.id
                                  ? -1
                                  : b.userId === user?.id
                                    ? 1
                                    : 0,
                              )
                              .slice(isLiked ? 2 : 1)
                              .map((liker: any, i: number) => (
                                <li key={i}>
                                  <Link
                                    href={`/${liker?.user?.username}`}
                                    className="hover:underline"
                                  >
                                    {liker.user.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs">
              {post.comments.length > 0 && (
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={user ? handleViewComment(post.id) : handleNavigate}
                  className="hover:underline relative group flex gap-1 items-center"
                >
                  <i className="fa-solid fa-comment"></i>
                  {post.comments.length}{" "}
                  {post.comments.length === 1 ? "comment" : "comments"}
                  <div className="hidden group-hover:block absolute bottom-full right-0 mb-1 w-48 max-h-60 overflow-y-auto bg-gray-900/90 text-white text-xs rounded-xl px-3 py-2 z-50 shadow-xl">
                    <ul className="space-y-1">
                      {post.comments
                        .filter(
                          (v: any, i: any, s: any) =>
                            i ===
                            s.findIndex((c: any) => c.userId === v.userId),
                        )
                        .sort((a: any, b: any) =>
                          a.userId === user?.id
                            ? -1
                            : b.userId === user?.id
                              ? 1
                              : 0,
                        )
                        .map((c: any, i: number) => (
                          <li key={i}>
                            {c?.user ? (
                              <Link
                                href={`/${c?.user?.username}`}
                                className="hover:underline"
                              >
                                {c.userId === user?.id
                                  ? "You"
                                  : (c.user.name ?? "Anonymous")}
                              </Link>
                            ) : c.userId === user?.id ? (
                              "You"
                            ) : (
                              "Deleted User"
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-gray-100 dark:border-gray-800 flex">
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

        {/* Comments Section */}
        {(isCommentOpen[post.id] || post.comments.length > 0) && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-3">
            {post.comments.slice(0, 1).map((c: any, i: number) => (
              <CommentsList
                key={i}
                comment={c}
                author={c.userId === post.userId}
                commentOwner={c.userId === user?.id}
              />
            ))}
            {user && (
              <div className="flex gap-2 items-start pt-1">
                <Image
                  avatar={user?.profile_pictures[0]?.avatar}
                  alt={user?.name}
                  h={8}
                  w={8}
                />
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 pt-2 relative">
                  <TextAreaComment
                    ref={textareaRef}
                    onClick={() => setIsOpen(true)}
                    value={comment}
                    error={error.comment?.message}
                    onKeyDown={handleKeyDown(post.id)}
                    onChange={(e: any) => setComment(e.target.value)}
                    onInput={handleInput}
                    placeholder={`Comment as ${user?.name ?? "Anonymous"}`}
                    rows={1}
                  />
                  {isOpen && (
                    <div className="flex justify-between pb-2 items-center">
                      <i className="fa-regular fa-face-smile text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors"></i>
                      <button
                        type="button"
                        disabled={!comment}
                        onClick={
                          comment ? handleSubmitComment(post.id) : undefined
                        }
                        className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors ${!comment ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"}`}
                      >
                        <i className="fa-solid fa-paper-plane-top text-sm"></i>
                      </button>
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
