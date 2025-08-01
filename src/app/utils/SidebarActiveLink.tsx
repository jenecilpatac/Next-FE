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
          ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
          : ""
      } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
