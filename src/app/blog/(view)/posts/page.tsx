"use client";

import { useEffect, useRef, useState } from "react";
import { Post } from "../../types/PostType";
import { useAuth } from "@/app/context/AuthContext";
import useFetch from "../../hooks/fetchData";
import PostLoader from "../../components/loaders/PostLoader";
import AddPost from "../../components/modals/AddPost";
import PostsList from "../../components/PostsList";
import publicAuth from "@/app/lib/publicAuth";
import { formatDate } from "date-fns";

const Posts = () => {
  const { isAuthenticated, user }: any = useAuth();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, loading, loadingOnTake, setAddTake, error }: any = useFetch(
    `/posts`,
    isRefresh,
    true,
  );
  const { data: categoriesData, loading: categoriesLoading }: any = useFetch(
    `/categories`,
    false,
    false,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null);

  const filteredPosts = data.posts
    ? data.posts.filter(
        (post: any) =>
          post.description
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()) ||
          post.category.categoryName
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()) ||
          post.category.slug
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()) ||
          post?.user?.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()) ||
          (post?.user === null &&
            "Deleted User"
              .toLowerCase()
              .includes(searchTerm.trim().toLowerCase())) ||
          formatDate(post.createdAt, "MMMM dd, yyyy")
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()),
      )
    : [];

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !error &&
          !loadingOnTake &&
          filteredPosts?.length < data?.totalData &&
          !searchTerm
        ) {
          setAddTake((prev: any) => prev + 10);
        }
      },
      {
        threshold: 1.0,
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [loadingOnTake, sentinelRef, filteredPosts, data, error]);

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  // const handleShowMore = () => {
  //   setAddTake((prev: any) => prev + 10);
  // };

  return (
    <div className="p-4 dark:bg-black mx-auto">
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Posts
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Explore the latest posts from the community
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                value={searchTerm}
                maxLength={255}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                className="py-2 pl-9 pr-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Search posts..."
              />
            </div>
            {isAuthenticated && (
              <button
                ref={buttonRef}
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <i className="fa-solid fa-plus text-xs"></i> Add Post
              </button>
            )}
          </div>
        </div>
        <hr className="mt-4 border-gray-200 dark:border-gray-700" />
      </div>

      <div className="py-4 sm:w-full md:w-full lg:w-3/4 xl:w-2/4 mx-auto overflow-hidden">
        {loading ? (
          <PostLoader />
        ) : filteredPosts?.length > 0 ? (
          filteredPosts?.map((post: Post, index: number) => (
            <PostsList key={index} post={post} setIsRefresh={setIsRefresh} />
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-newspaper text-2xl text-gray-400"></i>
              </div>
              <h1 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                {searchTerm
                  ? "No Results Found"
                  : data.message || "No Posts Added Yet"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                {searchTerm ? (
                  <>
                    No posts match "
                    <span className="font-semibold break-words">
                      {searchTerm}
                    </span>
                    ".
                  </>
                ) : (
                  "No posts available right now. Check back later!"
                )}
              </p>
            </div>
          </div>
        )}
        {data?.posts && (
          <div className="flex justify-center items-center">
            {loadingOnTake ? (
              <i className="fa-duotone fa-solid fa-spinner-third animate-spin"></i>
            ) : error ? (
              <p className="text-sm dark:text-gray-500 text-gray-400 font-bold">
                {error.message}
              </p>
            ) : (
              filteredPosts?.length >= data?.totalData && (
                <p className="text-sm dark:text-gray-500 text-gray-400 font-bold">
                  All posts loaded
                </p>
              )
            )}
          </div>
        )}
        <span ref={sentinelRef} className="bg-transparent"></span>
      </div>
      <AddPost
        onClose={setIsOpen}
        isOpen={isOpen}
        setIsRefresh={setIsRefresh}
        modalRef={modalRef}
        categories={categoriesData.categories}
        categoriesLoading={categoriesLoading}
        user={user}
      />
    </div>
  );
};

export default publicAuth(Posts);
