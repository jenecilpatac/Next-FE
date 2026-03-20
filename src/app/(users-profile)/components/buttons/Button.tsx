export default function Button({ children, bgColor, hoverBgColor, ...props }: any) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors bg-${bgColor} hover:bg-${hoverBgColor}`}
    >
      {children}
    </button>
  );
}
