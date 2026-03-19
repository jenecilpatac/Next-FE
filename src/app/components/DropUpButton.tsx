"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function DropUpButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const themeFromStorage = localStorage.getItem("theme");
    if (mounted) {
      setActiveTheme(themeFromStorage);
    } else {
      if (!themeFromStorage) {
        setTheme("system");
      }
    }
  }, [mounted, setTheme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="px-2 py-1 text-xl text-white transition-all border shadow-md border-white rounded-lg bg-gray-900 dark:bg-white hover:text-black"
      >
        {!mounted ? (
          <i className="far cursor-pointer fa-eclipse"></i>
        ) : activeTheme === "dark" ? (
          <i className="fa-solid fa-moon-stars cursor-pointer text-blue-500"></i>
        ) : activeTheme === "light" ? (
          <i className="fa-solid fa-sun-bright cursor-pointer text-yellow-500"></i>
        ) : activeTheme === "system" ? (
          <i className="fa-solid fa-computer cursor-pointer text-gray-500"></i>
        ) : null}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full right-0 mb-2 w-32 bg-white border rounded-lg shadow-md"
        >
          <ul className="p-2 space-y-2 text-black">
            <li
              onClick={() => setTheme("dark")}
              className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 hover:text-black transition-all ${
                activeTheme === "dark"
                  ? "bg-gray-200 text-black"
                  : "text-gray-700"
              }`}
            >
              <i
                className={`fa-solid fa-moon-stars ${
                  activeTheme === "dark" ? "text-blue-600" : "text-blue-500"
                }`}
              ></i>
              <span>Dark</span>
            </li>

            <li
              onClick={() => setTheme("light")}
              className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 hover:text-black transition-all ${
                activeTheme === "light"
                  ? "bg-gray-200 text-black"
                  : "text-gray-700"
              }`}
            >
              <i
                className={`fa-solid fa-sun-bright ${
                  activeTheme === "light"
                    ? "text-yellow-600"
                    : "text-yellow-500"
                }`}
              ></i>
              <span>Light</span>
            </li>

            <li
              onClick={() => setTheme("system")}
              className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 hover:text-black transition-all ${
                activeTheme === "system"
                  ? "bg-gray-200 text-black"
                  : "text-gray-700"
              }`}
            >
              <i
                className={`fa-solid fa-computer ${
                  activeTheme === "system" ? "text-gray-600" : "text-gray-500"
                }`}
              ></i>
              <span>System</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
