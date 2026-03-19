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
import Button from "../../components/buttons/Button";

const UserProfile = () => {
  const { username } = useParams();
  const [isRefresh, setIsRefresh] = useState(false);
  const { data, loading, error }: any = useFetch(
    `users/profile/${username}`,
    isRefresh
  );
  const [active, setActive] = useState("posts");
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleActive = (data: string) => () => {
    setActive(data);
  };

  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };

  const isSetProfile = data?.profile_pictures?.filter(
    (avatar: any) => avatar?.isSet !== null
  );

  if (error?.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-700 my-3 rounded-md max-w-5xl mx-auto">
      {loading ? (
        <>
          <ProfileLoader />
          <div className="w-full md:w-2/3 mx-auto mt-5">
            <PostLoader />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center space-y-2 justify-between">
            <div className="flex flex-col sm:flex-row items-center space-x-4">
              <div className="relative">
                {isImageLoading && <ImageProfileLoader />}

                <img
                  onLoad={handleImageLoaded}
                  src={
                    isSetProfile && isSetProfile?.length === 0
                      ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                      : Storage(isSetProfile && isSetProfile[0]?.avatar)
                  }
                  alt="User Avatar"
                  className={`w-32 h-32 rounded-full border-2 border-gray-300 dark:border-gray-600 ${
                    isImageLoading ? "hidden" : ""
                  }`}
                />
              </div>

              <div className="justify-items-center sm:justify-items-start">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data?.name}{" "}
                  {data?.emailVerifiedAt !== null && (
                    <i className="fa-solid fa-badge-check text-blue-500 text-md"></i>
                  )}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {data?.jobTitle}
                </p>
                <div className="flex gap-2 mt-5">
                  <Button
                    type="button"
                    bgColor="blue-500"
                    hoverBgColor="blue-600"
                  >
                    <i className="fa-solid fa-user-plus"></i> Add Friend
                  </Button>
                  <Button
                    type="button"
                    bgColor="gray-500"
                    hoverBgColor="gray-600"
                  >
                    <i className="fa-solid fa-layer-plus"></i> Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 justify-items-center sm:justify-items-start">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bio
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {data?.bio ? (
                data?.bio
              ) : (
                <span className="mt-2 text-gray-700 dark:text-gray-300 italic text-sm">
                  "You haven't posted your bio yet."
                </span>
              )}
            </p>
          </div>

          <div className="mt-8 justify-items-center sm:justify-items-start">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Personal Details
            </h2>
            <ul
              role="list"
              className="marker:text-blue-300 list-disc pl-5 space-y-2 text-gray-500 dark:text-gray-400 mt-2"
            >
              {data?.address &&
              data?.phoneNumber &&
              data?.dateOfBirth &&
              data?.gender ? (
                <>
                  <li>{data?.phoneNumber}</li>
                  <li>{data?.address}</li>
                  <li>
                    {data?.dateOfBirth &&
                      formatDate(data?.dateOfBirth, "MMMM dd, yyyy")}
                  </li>
                  <li>{data?.gender}</li>
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
                <div className="w-full flex justify-center mt-5">
                  <div className="w-full md:w-2/3">
                    {data.posts?.length > 0 ? (
                      data.posts?.map((post: any, index: number) => (
                        <PostsList key={index} post={post} setIsRefresh={setIsRefresh} />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-48 w-full">
                        <p className="text-center font-bold">
                          This user has no posts
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : data?.profile_pictures.length === 0 ? (
              <div className="flex items-center justify-center h-48 mt-5 w-full">
                <p className="text-center font-bold">No photos added</p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2">
                {data?.profile_pictures.map((image: any, index: number) => (
                  <AvatarList key={index} image={image} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default publicAuth(UserProfile);
