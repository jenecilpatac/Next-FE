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
    <button
      disabled={isLoading || props.disabled}
      {...props}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-${bgColor} ${
        isLoading || props.disabled
          ? "opacity-60 cursor-not-allowed"
          : `hover:bg-${hoverBgColor}`
      }`}
    >
      {isLoading ? (
        <>
          <i className="fa-solid fa-spinner animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <i className={`fa-solid fa-${icon}`} />
          {label}
        </>
      )}
    </button>
  );
}
