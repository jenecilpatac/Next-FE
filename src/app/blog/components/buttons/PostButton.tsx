export default function PostButton({ icon, label, isLiked, ...props }: any) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg w-full text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isLiked
          ? "text-blue-500 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-300"
      }`}
    >
      <i className={`fa-solid fa-${icon} text-base`}></i>
      <span>{label}</span>
    </button>
  );
}
