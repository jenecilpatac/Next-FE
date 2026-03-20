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
    false,
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
          post.slug.toLowerCase().includes(searchTerm.trim().toLowerCase()),
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
      showError(
        error?.response?.data || `${error.message} or server error.`,
        "Error",
      );
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
    }
  };

  return (
    <div className="mx-auto p-4 dark:bg-black">
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blog Categories
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Browse and explore all available categories
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                maxLength={255}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                className="py-2 pl-9 pr-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Search categories..."
              />
            </div>
            {isAuthenticated && hasHigherRole && (
              <button
                ref={buttonRef}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleOpenModal}
              >
                <i className="fa-solid fa-plus text-xs"></i> Add Category
              </button>
            )}
          </div>
        </div>
        <hr className="mt-4 border-gray-200 dark:border-gray-700" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 overflow-hidden">
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
                post.categoryName,
              )}
            />
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-folder-open text-2xl text-gray-400"></i>
              </div>
              <h1 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                {searchTerm
                  ? "No results found"
                  : data.message || "No Blog Categories Added Yet"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                {searchTerm ? (
                  <>
                    No categories match "
                    <span className="font-semibold break-words">
                      {searchTerm}
                    </span>
                    ".
                  </>
                ) : (
                  "No categories available right now. Check back later!"
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
        handleProceedDeleteCategory={handleProceedDeleteCategory(
          isDeleteOpen.id,
        )}
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
