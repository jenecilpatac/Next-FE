"use client";

import Link from "next/link";
import publicAuth from "./lib/publicAuth";

const features = [
  { icon: "fa-pen-nib", label: "Blog Posts" },
  { icon: "fa-list-check", label: "Todo Tracker" },
  { icon: "fa-chart-bar", label: "NBA Tallies" },
  { icon: "fa-comments", label: "Live Chats" },
];

const Home = () => {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/269583/pexels-photo-269583.jpeg?cs=srgb&dl=pexels-pixabay-269583.jpg&fm=jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm">
          <i className="fa-solid fa-circle-bolt text-blue-400" />
          Your all-in-one platform
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 text-4xl font-bold sm:text-5xl">
            Blog App
          </span>
        </h1>

        <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
          Explore blogs, manage your todos, follow NBA tallies, and chat with
          others — all in one place.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {features.map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/80 bg-white/10 border border-white/10 rounded-full backdrop-blur-sm"
            >
              <i className={`fa-solid ${icon} text-blue-400`} />
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-rocket" />
            Get Started
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-magnifying-glass" />
            Explore Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default publicAuth(Home);
