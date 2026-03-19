import Link from "next/link";
import { usePathname } from "next/navigation";

const ChildActiveLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const normalize = (p: string) => p.replace(/\/$/, "");
  const isActive =
    href === "/"
      ? pathname === href
      : normalize(pathname).startsWith(normalize(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 pl-10 pr-3 py-2 text-sm rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        }`}
    >
      {children}
    </Link>
  );
};

export default ChildActiveLink;
