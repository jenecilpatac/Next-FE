"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import navItems from "@/data/navbar.json";
import { NavItem } from "../types/navbar-tyoe";

const socialLinks = [
  {
    href: "#",
    icon: "fab fa-facebook-f",
    label: "Facebook",
    color: "hover:bg-blue-600",
  },
  {
    href: "#",
    icon: "fab fa-instagram",
    label: "Instagram",
    color: "hover:bg-pink-600",
  },
  {
    href: "#",
    icon: "fab fa-linkedin-in",
    label: "LinkedIn",
    color: "hover:bg-blue-700",
  },
  {
    href: "#",
    icon: "fab fa-x-twitter",
    label: "X",
    color: "hover:bg-gray-700",
  },
];

export default function Footer() {
  const { isAuthenticated }: any = useAuth();

  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900 text-gray-400 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2065/2065254.png"
                  className="h-5 w-5 brightness-0 invert"
                  alt="Blog App"
                />
              </div>
              <span className="text-lg font-semibold text-white">Blog App</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Share ideas, track todos, follow NBA tallies, and connect with
              others — all in one place.
            </p>
            {/* Social icons */}
            <div className="flex gap-2.5">
              {socialLinks.map(({ href, icon, label, color }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white ${color} hover:-translate-y-1 transition-all duration-300`}
                >
                  <i className={`${icon} text-xs`} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navItems.map(
                (item: NavItem) =>
                  (item.is_always_display ||
                    item.show_on_auth === isAuthenticated) && (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-sm hover:text-blue-400 hover:translate-x-1.5 transition-all duration-200 group"
                      >
                        <i
                          className={`fa-solid ${item.icon} text-blue-500/60 group-hover:text-blue-400 text-xs w-4`}
                        />
                        {item.label}
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fa-solid fa-location-dot text-blue-400 text-xs" />
                </span>
                <span className="leading-snug">Tinangnan, Tubigon, Bohol</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-envelope text-blue-400 text-xs" />
                </span>
                <a
                  href="mailto:mydummy.2022.2023@gmail.com"
                  className="hover:text-blue-400 transition-colors truncate"
                >
                  mydummy.2022.2023@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-phone text-blue-400 text-xs" />
                </span>
                <span>09123456789</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Newsletter
            </h3>
            <p className="text-sm mb-4 leading-relaxed">
              Stay updated with the latest posts and features.
            </p>
            <form className="space-y-2.5">
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <i className="fa-solid fa-paper-plane text-xs" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800" />

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; 2024
            {new Date().getFullYear() > 2024
              ? `–${new Date().getFullYear()}`
              : ""}{" "}
            <span className="text-gray-400">Blog App.</span> All rights
            reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="w-px h-3 bg-gray-700" />
            <Link href="#" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
