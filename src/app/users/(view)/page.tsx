"use client";

import { useEffect, useRef, useState } from "react";
import useFetch from "../hooks/fetchData";
import UserItemList from "../components/UserItemList";
import UserItemListLoader from "../components/loaders/UserItemListLoader";
import api from "@/app/lib/axiosCall";
import useToastr from "../hooks/Toastr";
import withRoleAuth from "@/app/lib/withRoleAuth";
import AddUser from "../components/modals/AddUser";
import DeleteConfirmation from "../components/modals/DeleteConfirmation";
import Pagination from "@/app/components/pagination/Pagination";

const Users = () => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");
  const {
    data,
    loading,
    error,
    setCurrentPage,
    currentPage,
    itemsPerPage,
  }: any = useFetch("/users", isRefresh, true);
  const { showSuccess, showError }: any = useToastr();
  const [userName, setUserName] = useState("");
  const modalRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVerifyUser = async (id: string) => {
    setIsRefresh(true);
    setIsLoading(true);
    setId(id);
    try {
      const response = await api.post(`/users/verify-user/${id}`, {
        id,
      });

      if (response.data.statusCode === 200) {
        showSuccess(response.data.message, "Verified");
        setId("");
      }
      if (response.data.statusCode === 400) {
        showError(response.data.message, "Error");
        setId("");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRefresh(false);
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setIsRefresh(true);
    setIsLoading(true);
    try {
      const response = await api.delete(`/users/${id}`);

      if (response.status === 200) {
        showSuccess(response.data.message, "Deleted");
        setUserName("");
        setId("");
        handleConfirmDelete(id, userName);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 403) {
        showError(error.response.data.message, "Unauthorized");
      }
    } finally {
      setIsRefresh(false);
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = (id: string, name: string) => {
    setIsOpenConfirmDelete(!isOpenConfirmDelete);
    setUserName(name);
    setId(id);
  };

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-5 dark:bg-black min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Users</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage and monitor user accounts</p>
          </div>
          <button
            type="button"
            ref={buttonRef}
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <i className="fa-solid fa-user-plus text-xs"></i> Add User
          </button>
        </div>
        <hr className="mt-4 border-gray-200 dark:border-gray-800" />
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-11">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Username</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <UserItemListLoader />
              ) : data?.users?.users?.length > 0 ? (
                data.users?.users.map((user: any, index: number) => (
                  <UserItemList
                    item={user}
                    key={index}
                    index={index}
                    handleVerifyUser={handleVerifyUser}
                    handleConfirmDelete={handleConfirmDelete}
                    setIsRefresh={setIsRefresh}
                    isLoading={isLoading}
                    userId={id}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-users text-gray-400 text-lg"></i>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800">
          <Pagination
            totalItems={data?.users?.total ?? 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <AddUser
        isOpen={isOpen}
        onClose={handleOpenModal}
        modalRef={modalRef}
        setIsRefresh={setIsRefresh}
      />
      <DeleteConfirmation
        handleDeleteUser={handleDeleteUser}
        userName={userName}
        id={id}
        isOpen={isOpenConfirmDelete}
        onClose={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
};
export default withRoleAuth(Users);
