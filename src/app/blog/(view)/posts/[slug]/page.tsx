"use client";

import publicAuth from "@/app/lib/publicAuth";
import useFetch from "@/app/blog/hooks/fetchData";
import PostLoader from "@/app/blog/components/loaders/PostLoader";
import { Post } from "@/app/blog/types/PostType";
import PostsList from "@/app/blog/components/PostsList";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PostWithSlugs = () => {
  const { slug } = useParams();
  const [isRefresh, setIsRefresh] = useState(false);
  const { data, loading, error, setAddTake, loadingOnTake }: any = useFetch(
    `/categories/${slug}`,
    isRefresh,
    true
  );
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sentinelRef?.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingOnTake &&
          !error &&
          data?.category?.posts?.length < data?.category?._count?.posts
        ) {
          setAddTake((prev: any) => prev + 10);
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, data, loadingOnTake, setAddTake, error]);
  return (
    <div className="p-4 dark:bg-black mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Link href="/blog/posts">
          <i className="fa-solid fa-arrow-left"></i> Back to posts
        </Link>
        {loading ? (
          <>
            <span className="bg-slate-300 dark:bg-slate-400 h-6 rounded-lg animate-pulse w-96"></span>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">
              {error?.response?.statusText ||
                `${data?.category?.categoryName} posts`}
            </h1>
          </>
        )}
        <span>
          {data?.category?.posts && (
            <>
              Result(s):{" "}
              <span className="font-semibold">
                {data?.category?.posts?.length}
              </span>
            </>
          )}
        </span>
      </div>
      <hr />
      <div className="py-4 sm:w-full md:w-full lg:w-3/4 xl:w-2/4 mx-auto overflow-hidden">
        {loading ? (
          <PostLoader />
        ) : data?.category?.posts?.length > 0 ? (
          data?.category?.posts?.map((post: Post, index: number) => (
            <PostsList key={index} post={post} setIsRefresh={setIsRefresh} />
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full h-64 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
                {error
                  ? error?.response?.statusText
                  : data.message || "No Posts Added Yet"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {error
                  ? error?.response?.data.message
                  : "It looks like there are no posts available right now. Be patient and check back later!"}
              </p>
            </div>
          </div>
        )}
        {data?.category?.posts && (
          <div className="flex justify-center items-center">
            {loadingOnTake ? (
              <i className="fa-duotone fa-solid fa-spinner-third animate-spin"></i>
            ) : error ? (
              <p className="text-sm dark:text-gray-500 text-gray-400 font-bold">
                {error.message}
              </p>
            ) : (
              data?.category?.posts?.length >=
                data?.category?._count?.posts && (
                <p className="text-sm dark:text-gray-500 text-gray-400 font-bold">
                  All posts loaded
                </p>
              )
            )}
          </div>
        )}
        <span ref={sentinelRef}></span>
      </div>
    </div>
  );
};

export default publicAuth(PostWithSlugs);
