"use client";

import { useAuth } from "@/app/context/AuthContext";
import withAuth from "@/app/lib/withAuth";
import { formatDate } from "date-fns";
import { useEffect, useRef, useState } from "react";
import AddProfileModal from "../components/modals/AddProfilePicture";
import { Storage } from "@/app/utils/StorageUtils";
import AvatarList from "../components/AvatarList";
import EditProfile from "../components/modals/EditProfile";
import PostsList from "@/app/blog/components/PostsList";
import AddPost from "@/app/blog/components/modals/AddPost";
import useFetch from "../hooks/fetchData";
import ImageProfileLoader from "../components/loaders/ImageProfileLoader";
import PostLoader from "@/app/blog/components/loaders/PostLoader";

const Profile = () => {
  const { user, hasNormalRole, setIsRefresh, isSetProfile }: any = useAuth();
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPostRefresh, setIsPostRefresh] = useState(false);
  const { data: categoriesData, loading: categoriesLoading }: any = useFetch(
    `/categories`,
    false,
  );
  const { data: userPostsData, loading: userPostsDataLoading }: any = useFetch(
    "posts/own/user-posts",
    isPostRefresh,
  );
  const postButtonRef = useRef<HTMLButtonElement>(null);
  const postModalRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const addModalRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const editModalRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("posts");
  const [isOpen, setIsOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isAddProfileModalOpen &&
        addButtonRef.current &&
        !addButtonRef.current.contains(event.target as Node) &&
        addModalRef.current &&
        !addModalRef.current.contains(event.target as Node)
      ) {
        setIsAddProfileModalOpen(false);
      }
      if (
        isOpen &&
        postButtonRef.current &&
        !postButtonRef.current.contains(event.target as Node) &&
        postModalRef.current &&
        !postModalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        isEditProfileModalOpen &&
        !isAddProfileModalOpen &&
        editButtonRef.current &&
        !editButtonRef.current.contains(event.target as Node) &&
        editModalRef.current &&
        !editModalRef.current.contains(event.target as Node)
      ) {
        setIsEditProfileModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAddProfileModalOpen, isOpen, isEditProfileModalOpen]);

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-950 ${hasNormalRole ? "max-w-5xl mx-auto" : "md:ml-2"}`}
    >
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-36 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-b-2xl" />
        <div className="px-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14">
            {/* Avatar */}
            <div className="relative w-fit">
              {isImageLoading && <ImageProfileLoader />}
              <img
                onLoad={() => setIsImageLoading(false)}
                src={
                  isSetProfile?.length === 0 || isSetProfile === undefined
                    ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    : Storage(isSetProfile[0]?.avatar)
                }
                alt="User Avatar"
                className={`w-28 h-28 rounded-full border-4 border-white dark:border-gray-950 object-cover ${isImageLoading ? "hidden" : ""}`}
              />
              <button
                ref={addButtonRef}
                type="button"
                onClick={() => setIsAddProfileModalOpen(!isAddProfileModalOpen)}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gray-800/70 hover:bg-gray-800 text-white flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-camera text-xs" />
              </button>
            </div>

            {/* Edit button */}
            <button
              ref={editButtonRef}
              type="button"
              onClick={() => setIsEditProfileModalOpen(!isEditProfileModalOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors self-start sm:self-auto mt-2 sm:mt-0"
            >
              <i className="fa-solid fa-pen text-xs" />
              Edit Profile
            </button>
          </div>

          {/* Name / job / email */}
          <div className="mt-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {user?.name}
            </h1>
            {user?.jobTitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.jobTitle}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
              {user?.email}
              {user?.emailVerifiedAt !== null && (
                <i className="fa-solid fa-badge-check text-blue-500 text-xs" />
              )}
            </p>
          </div>

          {/* Bio */}
          {user?.bio && (
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 max-w-xl">
              {user?.bio}
            </p>
          )}

          {/* Personal details pills */}
          {(user?.address ||
            user?.phoneNumber ||
            user?.dateOfBirth ||
            user?.gender) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {user?.phoneNumber && (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-phone text-gray-400" />
                  {user.phoneNumber}
                </span>
              )}
              {user?.address && (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-location-dot text-gray-400" />
                  {user.address}
                </span>
              )}
              {user?.dateOfBirth && (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-cake-candles text-gray-400" />
                  {formatDate(user.dateOfBirth, "MMMM dd, yyyy")}
                </span>
              )}
              {user?.gender && (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-venus-mars text-gray-400" />
                  {user.gender}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-2">
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
          {["posts", "photos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                active === tab
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab}
              {tab === "posts" &&
                !userPostsDataLoading &&
                userPostsData?.length > 0 && (
                  <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                    {userPostsData.length}
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {active === "posts" ? (
            <>
              <div className="flex justify-center mb-4">
                <button
                  ref={postButtonRef}
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <i className="fa-solid fa-plus" />
                  Add Post
                </button>
              </div>
              <div className="w-full flex justify-center">
                <div className="w-full md:w-[55%]">
                  {userPostsDataLoading ? (
                    <PostLoader />
                  ) : userPostsData.length > 0 ? (
                    userPostsData.map((post: any, index: number) => (
                      <PostsList
                        key={index}
                        post={post}
                        setIsRefresh={setIsPostRefresh}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400 dark:text-gray-600">
                      <i className="fa-solid fa-newspaper text-3xl" />
                      <p className="text-sm font-medium">No posts yet</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : user?.profile_pictures.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400 dark:text-gray-600">
              <i className="fa-solid fa-images text-3xl" />
              <p className="text-sm font-medium">No photos added</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {user?.profile_pictures.map((image: any, index: number) => (
                <AvatarList
                  setIsRefresh={setIsRefresh}
                  key={index}
                  image={image}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <EditProfile
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(!isEditProfileModalOpen)}
        editModalRef={editModalRef}
        user={user}
        setIsRefresh={setIsRefresh}
        openAddProfileModal={() =>
          setIsAddProfileModalOpen(!isAddProfileModalOpen)
        }
        isSetProfile={isSetProfile}
      />
      <AddProfileModal
        isOpen={isAddProfileModalOpen}
        onClose={() => setIsAddProfileModalOpen(!isAddProfileModalOpen)}
        addModalRef={addModalRef}
        isSetProfile={isSetProfile}
        setIsRefresh={setIsRefresh}
      />
      <AddPost
        isOpen={isOpen}
        onClose={setIsOpen}
        postModalRef={postModalRef}
        categories={categoriesData.categories}
        categoriesLoading={categoriesLoading}
        setIsRefresh={setIsPostRefresh}
      />
    </div>
  );
};

export default withAuth(Profile);
