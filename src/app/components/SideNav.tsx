"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "./images/Image";

const dropdownItems = [
  { href: "/dashboard", icon: "fa-gauge", label: "Dashboard" },
  { href: "/chats", icon: "fa-comments", label: "Chats", target: "_blank" },
  { href: "/settings", icon: "fa-gears", label: "Settings" },
];

export default function SideNav({ toggleSideBar, sidebarButtonRef }: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isAuthenticated, user, logout, isSetProfile }: any = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Bottom accent line matching footer/navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left: hamburger (mobile) + brand */}
        <div className="flex items-center gap-3">
          <button
            ref={sidebarButtonRef}
            onClick={toggleSideBar}
            aria-controls="logo-sidebar"
            type="button"
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="sr-only">Open sidebar</span>
            <i className="fa-solid fa-bars-staggered text-base" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/128/2065/2065254.png"
                className="h-4 w-4 brightness-0 invert"
                alt="Blog App"
              />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              Blog App
            </span>
          </Link>
        </div>

        {/* Right: avatar + dropdown */}
        {isAuthenticated && (
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              className="rounded-full ring-2 ring-transparent hover:ring-blue-500 focus:ring-blue-500 transition-all duration-200"
            >
              <span className="sr-only">Open user menu</span>
              <Image
                avatar={isSetProfile && isSetProfile[0]?.avatar}
                alt={user?.name}
                h={8}
                w={8}
              />
            </button>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-11 w-60 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {/* Caret */}
                <div className="absolute right-3.5 -top-1.5 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-l border-t border-gray-100 dark:border-gray-700" />

                {/* Profile header */}
                <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                    <Image
                      avatar={isSetProfile && isSetProfile[0]?.avatar}
                      alt={user?.name}
                      h={9}
                      w={9}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                  {dropdownItems.map(({ href, icon, label, target }) => (
                    <Link
                      key={href}
                      href={href}
                      target={target}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <i
                        className={`fa-solid ${icon} w-4 text-center text-gray-400`}
                      />
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
