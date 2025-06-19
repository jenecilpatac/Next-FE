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
  const { data, loading, error }: any = useFetch(
    `/todos/status/ongoing`,
    isRefresh
  );
  const {
    hasHigherRole,
    isAuthenticated,
    loading: authLoading,
    isLogout,
  }: any = useAuth();
  const { showSuccess }: any = useToastr();
  const router: any = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return <LoadingLoaders />;

  if (!isAuthenticated && !isLogout) {
    return <UnauthorizedPage />;
  }

  const handleStatusUpdate = async (id: number, status: any) => {
    setIsRefresh(true);
    try {
      const response = await api.post(`/todos/change-status/${id}`, {
        status,
      });
      if (response.status === 201) {
        showSuccess(response.data.message, "Todo Status Updated");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRefresh(false);
    }
  };
  return (
    <div className="w-full p-5">
      <h2 className="text-2xl font-bold my-3">All Ongoing Todos</h2>
      <hr />
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
        <div className="w-full mt-5">
          {data?.todo?.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 ${
                hasHigherRole
                  ? "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  : "lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
              }`}
            >
              {data.todo.map((item: any, index: number) => (
                <div key={index}>
                  <OngoingStatusTodoList
                    item={item}
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
              <p className="text-2xl">You have no posted/ongoing todo yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default withAuth(Ongoing);
