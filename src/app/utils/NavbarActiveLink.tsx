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

  const normalizePath = (path: string) => path.replace(/\/$/, "");

  const isActive =
    href === "/"
      ? pathname === href
      : normalizePath(pathname).startsWith(normalizePath(href));

  return (
    <Link
      href={href}
      target={target}
      className={`${
        isActive
          ? "text-white bg-gray-300 md:bg-transparent md:dark:bg-transparent dark:bg-gray-700 md:text-gray-700 md:dark:text-blue-500"
          : ""
      } block py-2 px-3 text-gray-900 rounded hover:text-gray-900 hover:bg-gray-300 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
