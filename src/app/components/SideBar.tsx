import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SideNav from "./SideNav";
import ActiveLink from "../utils/SidebarActiveLink";
import ChildActiveLink from "../utils/ChildActiveLink";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "fa-gauge", label: "Dashboard" },
  { href: "/blog", icon: "fa-layer-group", label: "Blog Categories" },
  { href: "/blog/posts", icon: "fa-pen-nib", label: "Posts" },
  { href: "/users", icon: "fa-users", label: "Users" },
  { href: "/chats", icon: "fa-comments", label: "Chats", target: "_blank" },
  {
    href: "/tallies/schedules",
    icon: "fa-calendar-days",
    label: "NBA Schedules",
  },
  { href: "/tallies/teams", icon: "fa-people-group", label: "NBA Teams" },
];

const todoSubItems = [
  {
    href: "/todos/pending",
    label: "Pending",
    icon: "fa-clock-rotate-left",
    color: "text-red-500",
  },
  {
    href: "/todos/done",
    label: "Done",
    icon: "fa-check",
    color: "text-green-500",
  },
  {
    href: "/todos/ongoing",
    label: "Ongoing",
    icon: "fa-rotate",
    color: "text-blue-500",
  },
  {
    href: "/todos/cancelled",
    label: "Cancelled",
    icon: "fa-xmark",
    color: "text-red-400",
  },
];

const SideBar = ({ children }: any) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarButtonRef = useRef<HTMLButtonElement>(null);
  const { logout }: any = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        sidebarButtonRef.current &&
        !sidebarButtonRef.current.contains(target) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSideBar = () => setSidebarOpen(!sidebarOpen);

  const handleTodosClick = () => {
    if (pathname === "/todos") {
      setDropdownOpen(!dropdownOpen);
    } else {
      setDropdownOpen(true);
    }
  };

  const isTodosActive = pathname.startsWith("/todos");

  return (
    <>
      <SideNav
        toggleSideBar={toggleSideBar}
        sidebarButtonRef={sidebarButtonRef}
      />

      <aside
        ref={sidebarRef}
        id="logo-sidebar"
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 z-40 w-4/6 sm:w-64 h-screen pt-16 transition-transform duration-300 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col px-3 py-4 overflow-y-auto">
          <ul className="space-y-1 flex-1">
            {navItems.map(({ href, icon, label, target }) => (
              <li key={href} onClick={toggleSideBar}>
                <ActiveLink href={href} target={target}>
                  <i className={`fa-solid ${icon} w-5 text-center shrink-0`} />
                  <span className="ms-3 whitespace-nowrap">{label}</span>
                </ActiveLink>
              </li>
            ))}

            {/* Todos with dropdown */}
            <li>
              <button
                type="button"
                onClick={handleTodosClick}
                className="w-full"
              >
                <ActiveLink href="/todos">
                  <i className="fa-solid fa-clipboard w-5 text-center shrink-0" />
                  <span className="flex-1 ms-3 text-left whitespace-nowrap">
                    Todos
                  </span>
                  <i
                    className={`fa-solid fa-chevron-${dropdownOpen || isTodosActive ? "down" : "right"} text-xs text-gray-400 transition-transform duration-200`}
                  />
                </ActiveLink>
              </button>

              <ul
                className={`${
                  dropdownOpen || isTodosActive
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                } overflow-hidden transition-all duration-300 ease-in-out mt-1 space-y-1`}
              >
                {todoSubItems.map(({ href, label, icon, color }) => (
                  <li key={href} onClick={toggleSideBar}>
                    <ChildActiveLink href={href}>
                      <i
                        className={`fa-solid ${icon} ${color} w-4 text-center text-xs`}
                      />
                      <span className="ms-2">{label}</span>
                    </ChildActiveLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* Sign out */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
            <button
              onClick={() => logout()}
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="sm:ml-64 pt-16">
        <div className="p-4">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default SideBar;
