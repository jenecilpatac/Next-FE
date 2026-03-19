import Link from "next/link";

export default function CategoryList({
  post,
  handleSeemore,
  seemore,
  hasHigherRole,
  handleDeleteCategory
}: any) {
  return (
    <div
      data-aos="fade-up"
      className="bg-white hover:bg-gray-100 relative dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-2xl dark:bg-gray-900"
    >
      {hasHigherRole && (
        <button className="absolute top-3 right-4" onClick={handleDeleteCategory} type="button">
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
      <div className="h-auto min-h-32 overflow-hidden mb-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
          {post.categoryName}
        </h2>
        <div className="relative">
          <p
            className={`text-gray-600 mb-6 dark:text-white break-words whitespace-break-spaces ${
              !seemore[post.id] ? "line-clamp-3" : ""
            }`}
            title={post.description}
          >
            {post.description}
          </p>
          {post.description.length > 100 && (
            <button
              className="text-gray-500 text-sm absolute -bottom-6 left-0"
              onClick={() => handleSeemore(post.id)}
            >
              {!seemore[post.id] ? "See more..." : "See less..."}
            </button>
          )}
        </div>
      </div>
      <Link
        className="text-blue-600 hover:text-blue-500 absolute bottom-3"
        href={`/blog/posts/${post.slug}`}
      >
        View posts <i className="fa-solid fa-arrow-right text-xs"></i>
      </Link>
    </div>
  );
}
