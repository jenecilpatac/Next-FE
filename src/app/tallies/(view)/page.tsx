import Link from "next/link";
import React from "react";

export default function pages() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          'url("https://i.pinimg.com/600x315/a0/e8/2d/a0e82dc084c9f4f124a8fcb16f5b9e53.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center px-10 py-6 bg-black bg-opacity-40 rounded shadow-md">
        <div className="mb-7">
          <img
            src="https://cdn.worldvectorlogo.com/logos/dallas-mavericks.svg"
            alt=""
            className="w-64 h-64 rounded-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="hover:scale-105 flex">
            <Link
              href="/tallies/schedules"
              className="px-3 py-3 text-sm text-white bg-blue-600 rounded-lg shadow hover:bg-blue-800 hover:text-white transition"
            >
              <i className="fa-solid fa-coins"></i> Start Betting
            </Link>
          </div>
          <div className="hover:scale-105 flex">
            <Link
              href="/tallies/teams"
              className="px-3 py-3 text-sm text-white bg-cyan-400 rounded-lg shadow hover:bg-cyan-600 hover:text-white transition"
            >
              <i className="fa-solid fa-users"></i> View Teams
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
