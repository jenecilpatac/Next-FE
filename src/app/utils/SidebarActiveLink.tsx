import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({
  href,
  target,
  children,
}: {
  href: string;
  target?: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname.split("/")[pathname.split("/").length - 1] ===
    href.split("/")[href.split("/").length - 1];

  return (
    <Link
      href={href}
      target={target}
      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500 rounded-l-none"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent rounded-l-none"
        }`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
