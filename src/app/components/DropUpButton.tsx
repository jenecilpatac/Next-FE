"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const themes = [
  { value: "dark", label: "Dark", icon: "fa-moon", color: "text-blue-500" },
  { value: "light", label: "Light", icon: "fa-sun", color: "text-yellow-500" },
  {
    value: "system",
    label: "System",
    icon: "fa-computer",
    color: "text-gray-400",
  },
];

export default function DropUpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const { setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    setActiveTheme(localStorage.getItem("theme") ?? "system");
  }, []);

  useEffect(() => {
    if (!mounted && !localStorage.getItem("theme")) setTheme("system");
  }, [mounted, setTheme]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(t) &&
        buttonRef.current &&
        !buttonRef.current.contains(t)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setTheme(value);
    setActiveTheme(value);
    setIsOpen(false);
  };

  const current = themes.find((t) => t.value === activeTheme);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={`transition-all duration-200 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden w-36">
          {themes.map(({ value, label, icon, color }) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors
                ${
                  activeTheme === value
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                }`}
            >
              <i
                className={`fa-solid ${icon} ${activeTheme === value ? "text-blue-500" : color} w-4 text-center`}
              />
              {label}
              {activeTheme === value && (
                <i className="fa-solid fa-check ml-auto text-xs text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-lg transition-all duration-200 active:scale-95
          ${
            isOpen
              ? "bg-blue-500 text-white shadow-blue-500/30"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
          }`}
        aria-label="Toggle theme"
      >
        {mounted && current ? (
          <i
            className={`fa-solid ${current.icon} text-sm ${isOpen ? "text-white" : current.color}`}
          />
        ) : (
          <i className="fa-solid fa-circle-half-stroke text-sm text-gray-400" />
        )}
      </button>
    </div>
  );
}
