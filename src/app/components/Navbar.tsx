"use client";

import { useState, useEffect, useRef } from "react";
import ActiveLink from "../utils/NavbarActiveLink";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "./images/Image";
import navItems from "@/data/navbar.json";
import { NavItem } from "../types/navbar-tyoe";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonMenuRef = useRef<HTMLButtonElement>(null);

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
      if (
        buttonMenuRef.current &&
        !buttonMenuRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dropdownItems = [
    { href: "/dashboard", icon: "fa-gauge", label: "Dashboard" },
    { href: "/chats", icon: "fa-comments", label: "Chats", target: "_blank" },
    { href: "/settings", icon: "fa-gears", label: "Settings" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200 dark:border-gray-700 shadow-sm"
          : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
      }`}
    >
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex items-center justify-between mx-auto px-4 py-3">
        {/* Brand */}
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

        {/* Desktop nav */}
        <div
          ref={menuRef}
          className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-full left-0 right-0 md:top-auto bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent border-b md:border-0 border-gray-100 dark:border-gray-800 px-4 pb-4 md:p-0 md:order-1 gap-1 md:gap-0 shadow-lg md:shadow-none`}
          id="navbar-user"
        >
          <ul className="flex flex-col md:flex-row md:items-center md:gap-1 w-full md:w-auto mt-3 md:mt-0">
            {navItems.map(
              (item: NavItem) =>
                (item.is_always_display ||
                  item.show_on_auth === isAuthenticated) && (
                  <li key={item.href} onClick={() => setMenuOpen(false)}>
                    <ActiveLink href={item.href} target={item.target}>
                      <i className={`fa ${item.icon}`}></i>{" "}
                      <span>{item.label}</span>
                    </ActiveLink>
                  </li>
                ),
            )}
          </ul>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:order-2 relative">
          {isAuthenticated ? (
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
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg active:scale-95 transition-all duration-200 shadow-sm shadow-blue-500/30"
            >
              Login
            </Link>
          )}

          {/* User dropdown */}
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

          {/* Mobile hamburger */}
          <button
            ref={buttonMenuRef}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-controls="navbar-user"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <i
              className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars-staggered"} text-base`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
