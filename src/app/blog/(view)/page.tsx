"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddCategory from "../components/modals/AddCategory";
import useFetch from "../hooks/fetchData";
import CategoryLoader from "../components/loaders/CategoryLoader";
import publicAuth from "@/app/lib/publicAuth";
import CategoryList from "../components/CategoryList";
import ConfirmDelete from "../components/modals/ConfirmDelete";
import api from "@/app/lib/axiosCall";
import useToastr from "../hooks/Toastr";

const Blog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const { isAuthenticated, hasHigherRole }: any = useAuth();
  const { data, loading, error }: any = useFetch(
    "/categories",
    isRefresh,
    false
  );
  const { showSuccess, showError } = useToastr();
  const [seemore, setSeemore] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState({
    id: 0,
    open: false,
  });
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleOpenModal = async () => {
    setIsOpen(true);
  };

  const handleSeemore = (id: number) => {
    setSeemore((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPosts = data.categories
    ? data.categories.filter(
        (post: any) =>
          post.categoryName
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()) ||
          post.description
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()) ||
          post.slug.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : [];

  const handleDeleteCategory = (id: number, categoryName: string) => () => {
    setIsDeleteOpen({
      id,
      open: isDeleteOpen.id === id ? !isDeleteOpen.open : true,
    });
    setCategoryName(categoryName);
  };

  const handleProceedDeleteCategory = (id: number) => async () => {
    setIsLoading(true);
    setIsRefresh(true);
    try {
      const response = await api.delete(`/categories/${id}`);

      if (response.data.statusCode === 200) {
        setIsDeleteOpen({
          id: 0,
          open: false,
        });
        setCategoryName("");
        showSuccess(response.data.message, "Deleted");
      }
    } catch (error: any) {
      console.error(error);
      showError(error?.response?.data || `${error.message} or server error.`, "Error");
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
    }
  };

  return (
    <div className="mx-auto p-4 dark:bg-black">
      <div className="flex justify-between flex-wrap gap-5 items-center mb-4">
        <h1 className="text-2xl font-bold">Blog Categories</h1>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass left-3 top-3 absolute text-gray-400"></i>
          <input
            maxLength={255}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            className="py-2 pl-9 pr-2 rounded-lg active:ring-1 active:ring-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none border border-gray-400"
            placeholder="Search..."
          />
        </div>
        {isAuthenticated && hasHigherRole && (
          <button
            ref={buttonRef}
            className="bg-blue-600 text-white px-4 text-sm py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
            onClick={handleOpenModal}
          >
            <i className="fa-solid fa-plus"></i> Add Category
          </button>
        )}
      </div>
      <hr />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-8 overflow-hidden">
        {loading ? (
          <CategoryLoader />
        ) : filteredPosts?.length > 0 ? (
          filteredPosts.map((post: any, index: number) => (
            <CategoryList
              key={index}
              post={post}
              handleSeemore={handleSeemore}
              hasHigherRole={hasHigherRole}
              seemore={seemore}
              handleDeleteCategory={handleDeleteCategory(
                post.id,
                post.categoryName
              )}
            />
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full h-64 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
                {searchTerm
                  ? "No results found"
                  : data.message || "No Blog Categories Added Yet"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 w-96">
                {searchTerm ? (
                  <>
                    It looks like there are no categories available on your
                    search "
                    <span className="font-bold break-words">{searchTerm}</span>
                    ".
                  </>
                ) : (
                  "It looks like there are no categories available right now. Be patient and check back later!"
                )}
              </p>
            </div>
          </div>
        )}
      </div>
      <AddCategory
        isOpen={isOpen}
        modalRef={modalRef}
        onClose={setIsOpen}
        setIsRefresh={setIsRefresh}
      />

      <ConfirmDelete
        title={`Are you sure you want to delete ${categoryName}?`}
        handleProceedDeleteCategory={handleProceedDeleteCategory(isDeleteOpen.id)}
        isOpen={isDeleteOpen.open}
        isLoading={isLoading}
        onClose={handleDeleteCategory(isDeleteOpen.id, categoryName)}
      >
        If you delete this category, you will not be able to recover it!
      </ConfirmDelete>
    </div>
  );
};

export default publicAuth(Blog);
