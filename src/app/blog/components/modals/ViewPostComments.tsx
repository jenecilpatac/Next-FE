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
    false
  );
  const [comment, setComment] = useState("");
  const [error, setError] = useState<any>("");
  const [isOpenSec, setIsOpenSec] = useState(false);
  const { user }: any = useAuth();
  const textareaRef = useRef<any>("");
  const commentRef = useRef<any>("");

  if (!isOpen) {
    return null;
  }

  const handleSubmitComment = (postId: any) => async () => {
    setIsRefresh(true);
    setIsRefreshData(true);
    textareaRef.current.focus();
    try {
      const response = await api.post(`/comments/${postId}`, {
        comment,
      });

      if (response.status === 201) {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          setComment("");
          setError("");
        }
        if (commentRef.current) {
          commentRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
    } finally {
      setIsRefresh(false);
      setIsRefreshData(false);
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

  const handleFocus = () => {
    setIsOpenSec(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div
        className={`bg-white dark:bg-gray-800 shadow-md rounded-lg w-full md:w-2/4 relative ${
          isOpenSec ? "pt-5 pb-28" : "pt-5 pb-16"
        }`}
        ref={modalRef}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 rounded-full text-white hover:bg-gray-400 dark:hover:bg-gray-600 bg-gray-300 dark:bg-gray-500 px-2 py-0.5"
        >
          <i className="fa-solid fa-xmark text-xl mt-1"></i>
        </button>
        <h2 className="text-2xl font-bold text-center mb-5">
          {loading ? (
            <p className="h-8 w-36 rounded-md animate-pulse bg-slate-300 dark:bg-slate-400 mx-auto"></p>
          ) : (
            <>
              {data?.post?.user
                ? data?.post?.user?.name
                : data?.post?.user?.name === null
                ? "Anonymous"
                : "Deleted User"}
              &apos;s post
            </>
          )}
        </h2>
        <div className="max-h-[70vh] overflow-y-auto">
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
        {user && (
          <div className="flex gap-2 w-full px-3 pt-2 absolute bottom-4 bg-white dark:bg-gray-800">
            {loading ? (
              <p className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-400 animate-pulse"></p>
            ) : (
              <Image
                avatar={user?.profile_pictures[0]?.avatar}
                alt={user?.name}
                h={8}
                w={8}
              />
            )}
            <div className="w-full px-3 pt-2 dark:bg-gray-700 bg-gray-200 mx-2 rounded-3xl relative">
              <div className="relative">
                <TextAreaComment
                  ref={textareaRef}
                  value={comment}
                  error={error.comment?.message}
                  onKeyDown={handleKeyDown(data?.post?.id)}
                  onChange={handleInputChange}
                  onInput={handleInput}
                  placeholder={!loading ? `Comment as ${user?.name}` : ""}
                  onFocus={handleFocus}
                  rows={1}
                />
                {loading && (
                  <p className="top-0 rounded-3xl absolute h-6 w-full bg-slate-300 dark:bg-slate-400 animate-pulse"></p>
                )}
              </div>
              {!isOpenSec && (
                <div className="absolute top-2 right-3">
                  <i className="fa-solid fa-smile"></i>
                </div>
              )}
              {isOpenSec && (
                <div className="flex justify-between pb-2 items-center transition-all duration-300 ease-in-out">
                  <div>
                    <i className="fa-solid fa-smile"></i>
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled={!comment}
                      onClick={
                        comment
                          ? handleSubmitComment(data?.post?.id)
                          : undefined
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
    </div>
  );
}
