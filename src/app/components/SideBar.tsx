import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SideNav from "./SideNav";
import ActiveLink from "../utils/SidebarActiveLink";
import ChildActiveLink from "../utils/ChildActiveLink";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

const SideBar = ({ children }: any) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarButtonRef = useRef<HTMLButtonElement>(null);
  const { logout }: any = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarButtonRef.current &&
        !sidebarButtonRef.current.contains(event.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleSideBar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const toogleDropdown = () => {
    if (pathname === "/todos") {
      setDropdownOpen(!dropdownOpen);
    } else {
      setDropdownOpen(true);
    }
  };
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
          sidebarOpen ? "" : "-translate-x-full"
        } fixed top-0 left-0 z-40 w-4/6 sm:w-64 md:w-80 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li onClick={toggleSideBar}>
              <ActiveLink href="/dashboard">
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </ActiveLink>
            </li>
            <li onClick={toggleSideBar}>
              <ActiveLink href="/blog">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Blog Categories
                </span>
              </ActiveLink>
            </li>
            <li onClick={toggleSideBar}>
              <ActiveLink href="/blog/posts">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Posts</span>
              </ActiveLink>
            </li>
            <li onClick={toggleSideBar}>
              <button type="button" onClick={toogleDropdown} className="w-full">
                <ActiveLink href="/todos">
                  <i className="flex-shrink-0 w-5 h-5 text-2xl text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white far fa-clipboard-list-check"></i>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                    Todos
                  </span>
                  {dropdownOpen ? (
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 11"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 2l4 4-4 4"
                      />
                    </svg>
                  )}
                </ActiveLink>
              </button>
              <ul
                id="dropdown-example"
                className={`${
                  !dropdownOpen
                    ? "opacity-0 max-h-0 pointer-events-none -mt-4"
                    : "opacity-100 max-h-screen pointer-events-auto"
                } py-2 space-y-2 transition-all duration-200 ease-in-out`}
              >
                <li onClick={toggleSideBar}>
                  <ChildActiveLink href="/todos/pending">
                    Pending{" "}
                    <i className="far fa-clock-rotate-left ml-3 text-red-600"></i>
                  </ChildActiveLink>
                </li>
                <li onClick={toggleSideBar}>
                  <ChildActiveLink href="/todos/done">
                    Done <i className="far fa-check ml-3 text-green-500"></i>
                  </ChildActiveLink>
                </li>
                <li onClick={toggleSideBar}>
                  <ChildActiveLink href="/todos/ongoing">
                    Ongoing <i className="far fa-rotate ml-3 text-blue-600"></i>
                  </ChildActiveLink>
                </li>
                <li onClick={toggleSideBar}>
                  <ChildActiveLink href="/todos/cancelled">
                    Cancelled{" "}
                    <i className="far fa-file-xmark ml-3 text-red-400"></i>
                  </ChildActiveLink>
                </li>
              </ul>
            </li>
            <li onClick={toggleSideBar}>
              <ActiveLink href="/users">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
              </ActiveLink>
            </li>
            <li onClick={toggleSideBar}>
              <ActiveLink href="/chats" target="_blank">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 10c0 3.866-3.582 7-8 7a8.915 8.915 0 0 1-3.945-.902L2 17l1.311-3.279A6.74 6.74 0 0 1 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7Z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Chats</span>
              </ActiveLink>
            </li>
            <li onClick={toggleSideBar}>
              <ActiveLink href="/tallies/schedules">
                <i className="far fa-calendar flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  NBA Schedules
                </span>
              </ActiveLink>
            </li>
            <li onClick={toggleSideBar}>
              <ActiveLink href="/tallies/teams">
                <i className="far fa-people-group flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                <span className="flex-1 ms-3 whitespace-nowrap">NBA Teams</span>
              </ActiveLink>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a
                href="#"
                onClick={() => logout()}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i className="far fa-arrow-left-from-bracket"></i>
                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div className="sm:ml-64 mt-12">
        <div className="m-2 md:ml-16 mt-16 border-gray-200 rounded-lg dark:border-gray-700">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SideBar;
