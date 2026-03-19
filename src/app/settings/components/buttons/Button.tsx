export default function Button({
  label,
  bgColor,
  hoverBgColor,
  icon,
  isLoading,
  loadingText,
  ...props
}: any) {
  return (
    <>
      <button
        disabled={isLoading}
        {...props}
        className={`px-4 py-2 rounded-md text-white focus:outline-none text-sm bg-${bgColor} ${
          isLoading
            ? "cursor-not-allowed"
            : `hover:scale-105 hover:bg-${hoverBgColor}`
        }`}
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner animate-spin"></i> {loadingText}
          </>
        ) : (
          <>
            <i className={`fa-solid fa-${icon}`}></i> {label}
          </>
        )}
      </button>
    </>
  );
}
