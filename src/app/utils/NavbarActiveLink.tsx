import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({
  href,
  target,
  children,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname.split("/")[pathname.split("/").length - 1] ===
    href.split("/")[href.split("/").length - 1];

  return (
    <Link
      href={href}
      target={target}
      className={`gap-2 relative block md:inline-flex items-center px-3 py-2 md:py-1.5 text-sm font-medium rounded-md md:rounded-none transition-colors duration-200
        ${
          isActive
            ? "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 md:bg-transparent md:dark:bg-transparent border-l-2 md:border-l-0 border-blue-500 md:border-0"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent md:dark:hover:bg-transparent"
        }
        after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-blue-500
        after:transition-transform after:duration-200 after:origin-center
        ${isActive ? "after:scale-x-100 md:after:scale-x-100" : "after:scale-x-0 md:hover:after:scale-x-100"}
        after:hidden md:after:block
      `}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
