"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { isAuthenticated }: any = useAuth();

  return (
    <div className="bg-gray-50 text-sm dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8 md:px-8 w-full overflow-hidden text-gray-800 dark:text-gray-200">
      <div className="w-full mx-auto px-6">
        <div className="flex flex-wrap justify-center xl:justify-between gap-8 px-6 w-full">
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="text-center">
              <li className="transition-all duration-300 ease-in-out hover:translate-x-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="hover:text-blue-400 transition-all"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/" className="hover:text-blue-400 transition-all">
                    Home
                  </Link>
                )}
              </li>
              <li className="transition-all duration-300 ease-in-out hover:translate-x-2">
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-all"
                >
                  About
                </Link>
              </li>
              <li className="transition-all duration-300 ease-in-out hover:translate-x-2">
                <Link
                  href="/services"
                  className="hover:text-blue-400 transition-all"
                >
                  Services
                </Link>
              </li>
              <li className="transition-all duration-300 ease-in-out hover:translate-x-2">
                <Link
                  href="/tallies"
                  className="hover:text-blue-400 transition-all"
                >
                  Tallies
                </Link>
              </li>
              <li className="transition-all duration-300 ease-in-out hover:translate-x-2">
                <Link
                  href="/blog"
                  className="hover:text-blue-400 transition-all"
                >
                  Blogs
                </Link>
              </li>
              <li className="transition-all duration-300 ease-in-out hover:translate-x-2">
                <Link
                  href="/blog/posts"
                  className="hover:text-blue-400 transition-all"
                >
                  Posts
                </Link>
              </li>
              <li className="transition-all duration-300 ease-in-out hover:translate-x-2">
                <Link
                  href="/todos"
                  className="hover:text-blue-400 transition-all"
                >
                  Todos
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <p>Tinangnan, Tubigon, Bohol</p>
            <div className="relative group">
              <p className="transition-all duration-300 ease-in-out">
                Email: mydummy.2022.2023@gmail.com
              </p>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
            <p>Mobile: 09123456789</p>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mb-2 rounded-lg focus:ring-1 focus:outline-none focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400 hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <i className="fa-solid fa-paper-plane"></i> Subscribe
              </button>
            </form>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="hover:text-blue-400 hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link
                href="#"
                className="hover:text-blue-400 hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <i className="fab fa-twitter"></i>
              </Link>
              <Link
                href="#"
                className="hover:text-blue-400 hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <i className="fab fa-instagram"></i>
              </Link>
              <Link
                href="#"
                className="hover:text-blue-400 hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <i className="fab fa-linkedin-in"></i>
              </Link>
              <Link
                href="#"
                className="hover:text-blue-400 hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <i className="fab fa-x-twitter"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
          <p className="text-xs">&copy; 2024 - {new Date().getFullYear()} Blog App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
