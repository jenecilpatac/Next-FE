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
    process.env.NEXT_PUBLIC_SOCKET_URL as string,
  );
  const { data, loading, error }: any = useFetch("/todos", isRefresh);
  const { data: editData, loading: editLoading }: any = useFetch(
    isEdited[id] ? `/todos/id/${id}` : null,
    isRefresh || isSingleStatusRefresh,
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
    <div className="mx-auto p-4 dark:bg-black min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Todos
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your tasks and track progress
        </p>
        <hr className="mt-4 border-gray-200 dark:border-gray-800" />
      </div>

      <div className={`${hasHigherRole ? "lg:flex" : "md:flex"} gap-5`}>
        {/* Add / Edit Form */}
        <div className="mb-5 shrink-0">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm w-full sm:w-72 overflow-hidden">
            <div
              className={`px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 ${isEdited[id] ? "bg-amber-50 dark:bg-amber-900/10" : "bg-blue-50 dark:bg-blue-900/10"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${isEdited[id] ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
              >
                <i
                  className={`fa-solid ${isEdited[id] ? "fa-pen text-amber-600 dark:text-amber-400" : "fa-plus text-blue-600 dark:text-blue-400"} text-xs`}
                ></i>
              </div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                {isEdited[id] ? "Edit Todo" : "New Todo"}
              </h2>
            </div>
            <form
              onSubmit={isEdited[id] ? handleUpdateTodo : handleSubmitTodo}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-gray-800 dark:text-white ${isError.title ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                />
                {isError.title && (
                  <small className="text-red-500 text-xs mt-0.5 block">
                    {isError.title.message}
                  </small>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter content"
                  rows={4}
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none dark:bg-gray-800 dark:text-white ${isError.content ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
                />
                {isError.content && (
                  <small className="text-red-500 text-xs mt-0.5 block">
                    {isError.content.message}
                  </small>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 ${isEdited[id] ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"} disabled:opacity-60`}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin text-xs"></i>{" "}
                    {isEdited[id] ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <i
                      className={`fa-solid ${isEdited[id] ? "fa-check" : "fa-plus"} text-xs`}
                    ></i>{" "}
                    {isEdited[id] ? "Save Changes" : "Add Todo"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Todo Grid */}
        <div className="flex-1">
          {loading ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${hasHigherRole ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-4 xl:grid-cols-5"}`}
            >
              <AllTodosLoader />
            </div>
          ) : data?.todos?.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${hasHigherRole ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-4 xl:grid-cols-5"}`}
            >
              {data.todos.map((item: any, index: number) => (
                <TodoItemList
                  key={index}
                  item={item}
                  setIsEdited={setIsEdited}
                  isEdited={isEdited}
                  setId={setId}
                  handleStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <i className="fa-solid fa-clipboard-list text-2xl text-gray-400"></i>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No todos yet. Add your first one!
              </p>
            </div>
          )}
        </div>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-800" />

      {/* Status Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            label: "Ongoing",
            icon: "fa-arrows-rotate",
            color: "blue",
            accent: "bg-blue-500",
            light: "bg-blue-50 dark:bg-blue-900/10",
            component: (
              <TodoOngoing
                isSingleStatusRefresh={isSingleStatusRefresh}
                handleStatusUpdate={handleStatusUpdate}
                handleDeleteTodo={handleDeleteTodo}
                setIsEdited={setIsEdited}
                isEdited={isEdited}
                setId={setId}
              />
            ),
          },
          {
            label: "Completed",
            icon: "fa-circle-check",
            color: "green",
            accent: "bg-green-500",
            light: "bg-green-50 dark:bg-green-900/10",
            component: (
              <TodoCompleted
                isSingleStatusRefresh={isSingleStatusRefresh}
                handleDeleteTodo={handleDeleteTodo}
                handleStatusUpdate={handleStatusUpdate}
                setIsEdited={setIsEdited}
                isEdited={isEdited}
                setId={setId}
              />
            ),
          },
          {
            label: "Cancelled",
            icon: "fa-ban",
            color: "red",
            accent: "bg-red-500",
            light: "bg-red-50 dark:bg-red-900/10",
            component: (
              <TodoCancelled
                isSingleStatusRefresh={isSingleStatusRefresh}
                handleStatusUpdate={handleStatusUpdate}
                handleDeleteTodo={handleDeleteTodo}
              />
            ),
          },
        ].map((col) => (
          <div
            key={col.label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"
          >
            <div
              className={`flex items-center gap-2 px-4 py-3 ${col.light} border-b border-gray-100 dark:border-gray-800`}
            >
              <span className={`w-2 h-2 rounded-full ${col.accent}`}></span>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {col.label}
              </h4>
            </div>
            <div className="p-4 flex flex-col gap-3">{col.component}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Page);
