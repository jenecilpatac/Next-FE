export default function Button({ icon, color, hoverColor, ...props }: any) {
  return (
    <button
      {...props}
      className="w-9 h-9 flex items-center justify-center rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      <i className={`fa-solid fa-${icon} text-sm`} />
    </button>
  );
}
