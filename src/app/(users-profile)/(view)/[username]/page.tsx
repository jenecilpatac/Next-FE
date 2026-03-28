"use client";

import { formatDate } from "date-fns";
import { useState } from "react";
import PostsList from "@/app/blog/components/PostsList";
import PostLoader from "@/app/blog/components/loaders/PostLoader";
import { useParams } from "next/navigation";
import useFetch from "../../hooks/fetchData";
import ImageProfileLoader from "../../components/loaders/ImageProfileLoader";
import AvatarList from "../../components/AvatarList";
import publicAuth from "@/app/lib/publicAuth";
import NotFound from "@/app/not-found";
import { Storage } from "@/app/utils/StorageUtils";
import ProfileLoader from "../../components/loaders/ProfileLoader";

const UserProfile = () => {
  const { username } = useParams();
  const [isRefresh, setIsRefresh] = useState(false);
  const { data, loading, error }: any = useFetch(
    `users/profile/${username}`,
    isRefresh,
  );
  const [active, setActive] = useState("posts");
  const [isImageLoading, setIsImageLoading] = useState(true);

  const isSetProfile = data?.profile_pictures?.filter(
    (avatar: any) => avatar?.isSet !== null,
  );

  if (error?.status === 404) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 max-w-5xl mx-auto">
      {loading ? (
        <div className="p-6">
          <ProfileLoader />
          <div className="w-full md:w-2/3 mx-auto mt-5">
            <PostLoader />
          </div>
        </div>
      ) : (
        <>
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
                      isSetProfile && isSetProfile?.length === 0
                        ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                        : Storage(isSetProfile && isSetProfile[0]?.avatar)
                    }
                    alt="User Avatar"
                    className={`w-28 h-28 rounded-full border-4 border-white dark:border-gray-950 object-cover ${isImageLoading ? "hidden" : ""}`}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 self-start sm:self-auto mt-2 sm:mt-0">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <i className="fa-solid fa-user-plus" />
                    Add Friend
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <i className="fa-solid fa-layer-plus" />
                    Follow
                  </button>
                </div>
              </div>

              {/* Name / job */}
              <div className="mt-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  {data?.name}
                  {data?.emailVerifiedAt !== null && (
                    <i className="fa-solid fa-badge-check text-blue-500 text-base" />
                  )}
                </h1>
                {data?.jobTitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {data?.jobTitle}
                  </p>
                )}
              </div>

              {/* Bio */}
              {data?.bio && (
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 max-w-xl">
                  {data?.bio}
                </p>
              )}

              {/* Personal details pills */}
              {(data?.address ||
                data?.phoneNumber ||
                data?.dateOfBirth ||
                data?.gender) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {data?.phoneNumber && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <i className="fa-solid fa-phone text-gray-400" />
                      {data.phoneNumber}
                    </span>
                  )}
                  {data?.address && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <i className="fa-solid fa-location-dot text-gray-400" />
                      {data.address}
                    </span>
                  )}
                  {data?.dateOfBirth && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <i className="fa-solid fa-cake-candles text-gray-400" />
                      {formatDate(data.dateOfBirth, "MMMM dd, yyyy")}
                    </span>
                  )}
                  {data?.gender && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <i className="fa-solid fa-venus-mars text-gray-400" />
                      {data.gender}
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
                  {tab === "posts" && data?.posts?.length > 0 && (
                    <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                      {data.posts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {active === "posts" ? (
                <div className="w-full flex justify-center">
                  <div className="w-full md:w-2/3">
                    {data.posts?.length > 0 ? (
                      data.posts?.map((post: any, index: number) => (
                        <PostsList
                          key={index}
                          post={post}
                          setIsRefresh={setIsRefresh}
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
              ) : data?.profile_pictures.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400 dark:text-gray-600">
                  <i className="fa-solid fa-images text-3xl" />
                  <p className="text-sm font-medium">No photos added</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {data?.profile_pictures.map((image: any, index: number) => (
                    <AvatarList key={index} image={image} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default publicAuth(UserProfile);
