"use client";

import { useEffect, useState } from "react";
import useFetch from "../hooks/fetchData";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/axiosCall";
import useToastr from "../hooks/Toastr";
import { TodoType } from "../types/TodoType";
import TodoItemList from "../components/TodoItemList";
import AllTodosLoader from "../components/loaders/AllTodosLoader";
import TodoOngoing from "../components/TodoOngoing";
import TodoCompleted from "../components/TodoCompleted";
import TodoCancelled from "../components/TodoCancelled";
import useSocket from "../hooks/useSocket";
import withAuth from "@/app/lib/withAuth";

const Page = () => {
  const [id, setId] = useState<number | any>(null);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isSingleStatusRefresh, setIsSingleStatusRefresh] = useState(false);
  const [isEdited, setIsEdited] = useState<{ [key: number]: boolean }>({});
  const { todoAdded, addTodo } = useSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL as string
  );
  const { data, loading, error }: any = useFetch("/todos", isRefresh);
  const { data: editData, loading: editLoading }: any = useFetch(
    isEdited[id] ? `/todos/id/${id}` : null,
    isRefresh || isSingleStatusRefresh
  );
  const { hasHigherRole }: any = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<TodoType | any>([]);
  const { showSuccess, showError } = useToastr();

  useEffect(() => {
    if (editData.length !== 0) {
      setTitle(editData.todo.title);
      setContent(editData.todo.content);
    }
    if (!isEdited[id]) {
      setTitle("");
      setContent("");
    }
  }, [editData, isEdited[id]]);

  const handleSubmitTodo = async (e: any) => {
    setIsLoading(true);
    setIsRefresh(true);
    e.preventDefault();
    try {
      const response = await api.post("/todos/create-todos", {
        title,
        content,
      });

      if (response.status === 201) {
        showSuccess(response.data.message, response.statusText);
        setIsError([]);
      }
      setTitle("");
      setContent("");
    } catch (e: any) {
      console.error(e);
      setIsError(e.response.data);
    } finally {
      setIsRefresh(false);
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRefresh(true);
    setIsSingleStatusRefresh(true);
    try {
      const response = await api.post(`/todos/update-todos/${id}`, {
        title: title || editData.todo.title,
        content: content || editData.todo.content,
        status: editData.todo.status,
      });

      if (response.data.statusCode === 200) {
        showSuccess(response.data.message, "Todo Updated");
        setIsError([]);
        setTitle("");
        setContent("");
        setIsEdited({});
        setId(null);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
      setIsSingleStatusRefresh(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: any) => {
    setIsSingleStatusRefresh(true);
    setIsRefresh(true);
    try {
      const response = await api.post(`/todos/change-status/${id}`, {
        status,
      });
      if (response.data.statusCode === 200) {
        showSuccess(response.data.message, "Todo Status Updated");
      }
      if (response.data.statusCode === 400) {
        showError(response.data.message, "Invalid Status");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSingleStatusRefresh(false);
      setIsRefresh(false);
    }
  };
  const handleDeleteTodo = async (id: number) => {
    setIsSingleStatusRefresh(true);
    try {
      const response = await api.delete(`/todos/delete-todos/${id}`);
      if (response.data.statusCode === 200) {
        showSuccess(response.data.message, "Todo Deleted");
      }
      if (response.data.statusCode === 404) {
        showError(response.data.message, "Todo Deleted");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSingleStatusRefresh(false);
    }
  };

  return (
    <div className="space-y-4 mx-auto p-4 dark:bg-black">
      <h1 className="text-4xl font-semibold">Todos</h1>
      <div className={`${hasHigherRole ? "lg:flex" : "md:flex"} mx-auto gap-3`}>
        <div className="mb-5 flex justify-center">
          {isEdited[id] ? (
            <form onSubmit={(e) => handleUpdateTodo(e)}>
              <div className="rounded-md p-4 w-full border border-gray-200 dark:border-gray-700 sm:w-64 space-y-4 dark:bg-gray-900 bg-gray-50 transition-all ease-in-out duration-300 shadow-xl">
                <h2 className="text-xl">Edit Todo</h2>
                <hr />
                <div>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Title"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isError.title && "border-red-500"
                    }`}
                  />
                  {isError.title && (
                    <span className="text-red-500">
                      {isError.title.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="content">Content</label>
                  <textarea
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter Content"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isError.content && "border-red-500"
                    }`}
                  />
                  {isError.content && (
                    <span className="text-red-500">
                      {isError.content.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 rounded-md bg-blue-500 text-white text-sm hover:scale-105 hover:bg-blue-600 transition-all duration-300 ease-in-out"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i> Adding...
                    </>
                  ) : (
                    <>
                      <i className="far fa-edit"></i> Update Todo
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={(e) => handleSubmitTodo(e)}>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 w-full sm:w-64 space-y-4 dark:bg-gray-900 bg-gray-50 transition-all ease-in-out duration-300 transform shadow-xl">
                <h2 className="text-xl">Add Todo</h2>
                <hr />
                <div>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Title"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isError.title && "border-red-500"
                    }`}
                  />
                  {isError.title && (
                    <span className="text-red-500">
                      {isError.title.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="content">Content</label>
                  <textarea
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter Content"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isError.content && "border-red-500"
                    }`}
                  />
                  {isError.content && (
                    <span className="text-red-500">
                      {isError.content.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 rounded-md bg-blue-500 text-white text-sm hover:scale-105 hover:bg-blue-600 transition-all duration-300 ease-in-out"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i> Adding...
                    </>
                  ) : (
                    <>
                      <i className="far fa-plus"></i> Add Todo
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        {loading ? (
          <div className="w-full">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 ${
                hasHigherRole
                  ? "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  : "lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
              }`}
            >
              <AllTodosLoader />
            </div>
          </div>
        ) : (
          <div className="w-full">
            {data?.todos?.length > 0 ? (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 ${
                  hasHigherRole
                    ? "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                }`}
              >
                {data.todos.map((item: any, index: number) => (
                  <div key={index}>
                    <TodoItemList
                      item={item}
                      setIsEdited={setIsEdited}
                      isEdited={isEdited}
                      setId={setId}
                      handleStatusUpdate={handleStatusUpdate}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center flex flex-col items-center justify-center h-full">
                <p className="text-[70px] mb-3">
                  <i className="far fa-memo-circle-info text-[70px]"></i>
                </p>
                <p className="text-2xl">You have no posted/pending todo yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <hr />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <div className="dark:bg-gray-900 bg-gray-200 rounded-md p-4 shadow-md">
          <h4 className="text-xl font-semibold mb-2 bg-blue-400 text-center rounded-md py-2 text-white">
            <i className="far fa-arrows-rotate"></i> Ongoing
          </h4>
          <hr />
          <div className="flex flex-col gap-4">
            <TodoOngoing
              isSingleStatusRefresh={isSingleStatusRefresh}
              handleStatusUpdate={handleStatusUpdate}
              handleDeleteTodo={handleDeleteTodo}
              setIsEdited={setIsEdited}
              isEdited={isEdited}
              setId={setId}
            />
          </div>
        </div>
        <div className="dark:bg-gray-900 bg-gray-200 rounded-md p-4 shadow-md">
          <h4 className="text-xl font-semibold mb-2 bg-blue-700 text-center rounded-md py-2 text-white">
            <i className="far fa-memo-circle-check"></i> Completed
          </h4>
          <hr />
          <div className="flex flex-col gap-4">
            <TodoCompleted
              isSingleStatusRefresh={isSingleStatusRefresh}
              handleDeleteTodo={handleDeleteTodo}
              handleStatusUpdate={handleStatusUpdate}
              setIsEdited={setIsEdited}
              isEdited={isEdited}
              setId={setId}
            />
          </div>
        </div>
        <div className="dark:bg-gray-900 bg-gray-200 rounded-md p-4 shadow-md">
          <h4 className="text-xl font-semibold mb-2 bg-red-500 text-center rounded-md py-2 text-white">
            <i className="far fa-ban"></i> Cancelled
          </h4>
          <hr />
          <div className="flex flex-col gap-4">
            <TodoCancelled
              isSingleStatusRefresh={isSingleStatusRefresh}
              handleStatusUpdate={handleStatusUpdate}
              handleDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
