import { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/fetchData";
import SinglePost from "../SinglePost";
import SinglePostLoader from "../loaders/SinglePostLoader";
import Image from "../images/Image";
import TextAreaComment from "../inputs/TextAreaComment";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/axiosCall";

export default function ViewPostComments({
  isOpen,
  onClose,
  setIsRefresh,
  postId,
  modalRef,
}: any) {
  const [isRefreshData, setIsRefreshData] = useState(false);
  const { data, loading }: any = useFetch(
    isOpen && `/posts/${postId}`,
    isRefreshData,
    false,
  );
  const [comment, setComment] = useState("");
  const [error, setError] = useState<any>("");
  const [isOpenSec, setIsOpenSec] = useState(false);
  const { user }: any = useAuth();
  const textareaRef = useRef<any>("");
  const commentRef = useRef<any>("");

  if (!isOpen) return null;

  const handleSubmitComment = (postId: any) => async () => {
    setIsRefresh(true);
    setIsRefreshData(true);
    textareaRef.current.focus();
    try {
      const response = await api.post(`/comments/${postId}`, { comment });
      if (response.status === 201) {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          setComment("");
          setError("");
        }
        if (commentRef.current)
          commentRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error: any) {
      setError(error.response.data);
    } finally {
      setIsRefresh(false);
      setIsRefreshData(false);
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            {loading ? (
              <span className="h-5 w-40 rounded-lg animate-pulse bg-slate-200 dark:bg-slate-700 inline-block"></span>
            ) : (
              <>
                {data?.post?.user
                  ? data.post.user.name
                  : data?.post?.user?.name === null
                    ? "Anonymous"
                    : "Deleted User"}
                &apos;s post
              </>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-sm"></i>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <SinglePostLoader />
          ) : (
            <SinglePost
              post={data?.post}
              setIsRefresh={setIsRefresh}
              setIsRefreshData={setIsRefreshData}
              user={user}
              commentRef={commentRef}
            />
          )}
        </div>

        {/* Comment input */}
        {user && (
          <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-900">
            <div className="flex gap-2 items-start">
              {loading ? (
                <span className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0"></span>
              ) : (
                <Image
                  avatar={user?.profile_pictures[0]?.avatar}
                  alt={user?.name}
                  h={9}
                  w={9}
                />
              )}
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 pt-2 relative">
                <TextAreaComment
                  ref={textareaRef}
                  value={comment}
                  error={error.comment?.message}
                  onKeyDown={handleKeyDown(data?.post?.id)}
                  onChange={(e: any) => setComment(e.target.value)}
                  onInput={handleInput}
                  placeholder={!loading ? `Comment as ${user?.name}` : ""}
                  onFocus={() => setIsOpenSec(true)}
                  rows={1}
                />
                {isOpenSec && (
                  <div className="flex justify-between pb-2 items-center">
                    <i className="fa-regular fa-face-smile text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors"></i>
                    <button
                      type="button"
                      disabled={!comment}
                      onClick={
                        comment
                          ? handleSubmitComment(data?.post?.id)
                          : undefined
                      }
                      className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors ${!comment ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"}`}
                    >
                      <i className="fa-solid fa-paper-plane-top text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
