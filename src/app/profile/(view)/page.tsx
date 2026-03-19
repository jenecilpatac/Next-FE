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
    false
  );
  const { data: userPostsData, loading: userPostsDataLoading }: any = useFetch(
    "posts/own/user-posts",
    isPostRefresh
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddProfileModalOpen, isOpen, isEditProfileModalOpen]);

  const openAddProfileModal = () => {
    setIsAddProfileModalOpen(!isAddProfileModalOpen);
  };
  const openEditProfileModal = () => {
    setIsEditProfileModalOpen(!isEditProfileModalOpen);
  };

  const handleActive = (data: string) => () => {
    setActive(data);
  };

  const handleAddPost = () => {
    setIsOpen(!isOpen);
  };

  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };

  return (
    <div
      className={`min-h-screen p-6 bg-gray-100 dark:bg-gray-700 my-3 rounded-md ${
        hasNormalRole ? "max-w-5xl mx-auto" : "md:ml-2"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center space-y-2 justify-between">
        <div className="flex flex-col sm:flex-row items-center space-x-4">
          <div className="relative">
            {isImageLoading && <ImageProfileLoader />}

            <img
              onLoad={handleImageLoaded}
              src={
                isSetProfile?.length === 0 || isSetProfile === undefined
                  ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                  : Storage(isSetProfile[0]?.avatar)
              }
              alt="User Avatar"
              className={`w-32 h-32 rounded-full border-2 border-gray-300 dark:border-gray-600 ${
                isImageLoading ? "hidden" : ""
              }`}
            />
            <div className="group">
              <button
                ref={addButtonRef}
                type="button"
                onClick={openAddProfileModal}
                className="hover:bg-gray-500 hover:scale-95 transition-all duration-300 ease-in-out absolute top-[80px] border-2 border-gray-400 dark:border-gray-700 text-white rounded-full bg-gray-400 px-2 py-1 right-0"
              >
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user?.jobTitle}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {user?.email}{" "}
              {user?.emailVerifiedAt !== null && (
                <i className="fa-solid fa-badge-check text-blue-500 text-xs"></i>
              )}
            </p>
          </div>
        </div>
        <div>
          <button
            ref={editButtonRef}
            type="button"
            onClick={openEditProfileModal}
            className="hover:bg-blue-500 hover:scale-95 bg-opacity-75 hover:bg-opacity-75 transition-all duration-300 ease-in-out text-white rounded-lg bg-blue-400 px-2.5 py-1.5"
          >
            <i className="fa-solid fa-pen"></i> Edit Profile
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Bio
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          {user?.bio ? (
            user?.bio
          ) : (
            <span className="mt-2 text-gray-700 dark:text-gray-300 italic text-sm">
              "You haven't posted your bio yet."
            </span>
          )}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Personal Details
        </h2>
        <ul
          role="list"
          className="marker:text-blue-300 list-disc pl-5 space-y-2 text-gray-500 dark:text-gray-400 mt-2"
        >
          {user?.address &&
          user?.phoneNumber &&
          user?.dateOfBirth &&
          user?.gender ? (
            <>
              <li>{user?.phoneNumber}</li>
              <li>{user?.address}</li>
              <li>
                {user?.dateOfBirth &&
                  formatDate(user?.dateOfBirth, "MMMM dd, yyyy")}
              </li>
              <li>{user?.gender}</li>
            </>
          ) : (
            <>
              <li className="italic text-sm">No data</li>
            </>
          )}
        </ul>
      </div>

      <div className="mt-8">
        <div className="flex gap-5 border-b pb-2">
          <button
            onClick={handleActive("posts")}
            type="button"
            className={`px-2 py-1 text-gray-900 dark:text-white hover:bg-gray-200 hover:rounded-t-md dark:hover:bg-gray-600 ${
              active === "posts"
                ? "border-b-2 border-blue-400"
                : "hover:rounded-b-md"
            }`}
          >
            <h2 className="text-md font-semibold">Posts</h2>
          </button>
          <button
            onClick={handleActive("photos")}
            type="button"
            className={`px-2 py-1 text-gray-900 dark:text-white hover:bg-gray-200 hover:rounded-t-md dark:hover:bg-gray-600 ${
              active === "photos"
                ? "border-b-2 border-blue-400"
                : "hover:rounded-b-md"
            }`}
          >
            <h2 className="text-md font-semibold">Photos</h2>
          </button>
        </div>
        {active === "posts" ? (
          <>
            <div className="flex justify-center my-4">
              <button
                ref={postButtonRef}
                type="button"
                onClick={handleAddPost}
                className="hover:bg-blue-500 hover:scale-95 bg-opacity-75 hover:bg-opacity-75 transition-all duration-300 ease-in-out text-white rounded-lg bg-blue-400 px-2.5 py-1.5"
              >
                <i className="fa-solid fa-plus"></i> Add post
              </button>
            </div>
            <div className="w-full flex justify-center">
              <div className="w-full md:w-2/3">
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
                  <div className="flex items-center justify-center h-48 w-full">
                    <p className="text-center font-bold">
                      You have no posts yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : user?.profile_pictures.length === 0 ? (
          <div className="flex items-center justify-center h-48 w-full">
            <p className="text-center font-bold">No photos added</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2">
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
      <EditProfile
        isOpen={isEditProfileModalOpen}
        onClose={openEditProfileModal}
        editModalRef={editModalRef}
        user={user}
        setIsRefresh={setIsRefresh}
        openAddProfileModal={openAddProfileModal}
        isSetProfile={isSetProfile}
      />
      <AddProfileModal
        isOpen={isAddProfileModalOpen}
        onClose={openAddProfileModal}
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
