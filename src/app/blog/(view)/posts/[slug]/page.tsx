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
    true,
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
      },
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
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/blog/posts"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i> Back to posts
          </Link>
          {loading ? (
            <span className="bg-slate-200 dark:bg-slate-700 h-6 rounded-lg animate-pulse w-64"></span>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {error?.response?.statusText ||
                `${data?.category?.categoryName} posts`}
            </h1>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {data?.category?.posts && (
              <>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {data?.category?.posts?.length}
                </span>{" "}
                result(s)
              </>
            )}
          </span>
        </div>
        <hr className="mt-4 border-gray-200 dark:border-gray-700" />
      </div>
      <div className="py-4 sm:w-full md:w-full lg:w-3/4 xl:w-2/4 mx-auto overflow-hidden">
        {loading ? (
          <PostLoader />
        ) : data?.category?.posts?.length > 0 ? (
          data?.category?.posts?.map((post: Post, index: number) => (
            <PostsList key={index} post={post} setIsRefresh={setIsRefresh} />
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-newspaper text-2xl text-gray-400"></i>
              </div>
              <h1 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                {error
                  ? error?.response?.statusText
                  : data.message || "No Posts Added Yet"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                {error
                  ? error?.response?.data.message
                  : "No posts available right now. Check back later!"}
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
