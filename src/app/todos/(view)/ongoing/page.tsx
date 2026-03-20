"use client";

import { useEffect, useState } from "react";
import AllTodosLoader from "../../components/loaders/AllTodosLoader";
import useFetch from "../../hooks/fetchData";
import { useAuth } from "@/app/context/AuthContext";
import useToastr from "../../hooks/Toastr";
import api from "@/app/lib/axiosCall";
import OngoingStatusTodoList from "../../components/OngoingStatusTodoList";
import { useRouter } from "next/navigation";
import LoadingLoaders from "@/app/components/loaders/LoadingLoaders";
import UnauthorizedPage from "@/app/utils/UnauthorizedPage";
import withAuth from "@/app/lib/withAuth";

const Ongoing = () => {
  const [isRefresh, setIsRefresh] = useState(false);
  const { data, loading }: any = useFetch(`/todos/status/ongoing`, isRefresh);
  const {
    hasHigherRole,
    isAuthenticated,
    loading: authLoading,
    isLogout,
  }: any = useAuth();
  const { showSuccess, showError }: any = useToastr();
  const router: any = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return <LoadingLoaders />;
  if (!isAuthenticated && !isLogout) return <UnauthorizedPage />;

  const handleStatusUpdate = async (id: number, status: any) => {
    setIsRefresh(true);
    try {
      const response = await api.post(`/todos/change-status/${id}`, { status });
      if (response.data.statusCode === 200)
        showSuccess(response.data.message, "Status Updated");
      if (response.data.statusCode === 400)
        showError(response.data.message, "Error");
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRefresh(false);
    }
  };

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 gap-3 ${hasHigherRole ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-4 xl:grid-cols-5"}`;

  return (
    <div className="p-5 dark:bg-black min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-arrows-rotate text-blue-600 dark:text-blue-400 text-sm"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Ongoing Todos
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data?.todo?.length ?? 0} task(s)
            </p>
          </div>
        </div>
        <hr className="mt-4 border-gray-200 dark:border-gray-800" />
      </div>

      {loading ? (
        <div className={gridClass}>
          <AllTodosLoader />
        </div>
      ) : data?.todo?.length > 0 ? (
        <div className={gridClass}>
          {data.todo.map((item: any, index: number) => (
            <OngoingStatusTodoList
              key={index}
              item={item}
              handleStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3">
            <i className="fa-solid fa-arrows-rotate text-2xl text-blue-300 dark:text-blue-700"></i>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No ongoing todos
          </p>
        </div>
      )}
    </div>
  );
};

export default withAuth(Ongoing);
