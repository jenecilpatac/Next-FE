export default function Button({
  loadingText,
  label,
  isLoading,
  hoverBgColor,
  bgColor,
  ...props
}: any) {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={`w-full py-3 text-white bg-${bgColor} rounded-lg shadow hover:bg-${hoverBgColor} transition-all hover:scale-105 duration-300 ease-in-out ${
        isLoading ? "cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <span>
          <i className="fa-solid fa-spinner fa-pulse"></i> {loadingText}
        </span>
      ) : (
        <>{label}</>
      )}
    </button>
  );
}
