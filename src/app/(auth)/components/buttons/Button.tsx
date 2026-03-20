export default function Button({
  loadingText,
  label,
  isLoading,
  ...props
}: any) {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={`w-full py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2
        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <>
          <i className="fa-solid fa-spinner animate-spin" /> {loadingText}
        </>
      ) : (
        label
      )}
    </button>
  );
}
