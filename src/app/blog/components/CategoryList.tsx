import Link from "next/link";

export default function CategoryList({
  post,
  handleSeemore,
  seemore,
  hasHigherRole,
  handleDeleteCategory,
}: any) {
  return (
    <div
      data-aos="fade-up"
      className="group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-snug">
            {post.categoryName}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            {post._count.posts > 0 && (
              <span className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {post._count.posts} {post._count.posts === 1 ? "post" : "posts"}
              </span>
            )}
            {hasHigherRole && (
              <button
                onClick={handleDeleteCategory}
                type="button"
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Delete category"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 mb-4">
          <p
            className={`text-sm text-gray-500 dark:text-gray-400 break-words whitespace-break-spaces leading-relaxed ${
              !seemore[post.id] ? "line-clamp-3" : ""
            }`}
          >
            {post.description}
          </p>
          {post.description.length > 100 && (
            <button
              className="text-xs text-blue-500 hover:underline mt-1"
              onClick={() => handleSeemore(post.id)}
            >
              {!seemore[post.id] ? "See more" : "See less"}
            </button>
          )}
        </div>

        <Link
          href={`/blog/posts/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors mt-auto"
        >
          View posts
          <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
        </Link>
      </div>
    </div>
  );
}
