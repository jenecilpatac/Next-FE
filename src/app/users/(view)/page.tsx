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
    <div className="p-5">
      <div className="flex justify-between mb-3">
        <h1 className="text-2xl font-bold">All Users</h1>
        <button
          type="button"
          ref={buttonRef}
          onClick={handleOpenModal}
          className="bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white transition-all duration-300 ease-in-out text-md px-2 py-1 rounded"
        >
          <i className="far fa-user-plus"></i> Add User
        </button>
      </div>
      <hr />
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md mt-3">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-blue-500/70 dark:bg-gray-900 text-white">
              <th className="px-4 py-2 text-left w-11">ID</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Roles</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
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
                <td colSpan={7}>
                  <p className="text-center">No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalItems={data?.users?.total ?? 0}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
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
