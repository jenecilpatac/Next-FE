"use client";

import Link from "next/link";
import useFetch from "../../hooks/fetchData";
import NbaLogo from "../../utils/NbaLogo";
import ConferenceLogo from "../../utils/ConferenceLogo";
import { useState } from "react";
import TeamsSkeleton from "../../components/loaders/TeamsSkeleton";

export default function page() {
  const [checked, setChecked] = useState({
    East: "",
    West: "",
  });
  const { loading, data, error, setIsRefresh } = useFetch(
    "https://api.balldontlie.io/v1/teams"
  );

  const handleChecked = (name: string, isChecked: boolean) => {
    setChecked((prev) => ({
      ...prev,
      [name]: isChecked ? name : "",
    }));
    setIsRefresh(true);

    setTimeout(() => {
      setIsRefresh(false);
    }, 100);
  };
  return (
    <div className="mt-2 p-2">
      <div className="rounded-lg shadow-md p-5 bg-white dark:bg-gray-900 mt-3">
        <div className="flex justify-center mb-5 w-full">
          <Link
            href={"/tallies"}
            className="px-3 py-3 text-sm text-white hover:scale-105 bg-blue-600 rounded-lg shadow hover:bg-blue-800 hover:text-white transition"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Tallies
          </Link>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          List of{" "}
          {checked.East && checked.West
            ? "all teams"
            : checked.East
            ? "east teams"
            : checked.West
            ? "west teams"
            : "all teams"}
        </h1>
        <div className="flex justify-between">
          <div>
            {loading ? (
              <h1 className="h-6 w-32 bg-slate-300 dark:bg-slate-400 animate-pulse rounded mb-4"></h1>
            ) : (
              <h1 className="md:text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Total:{" "}
                {
                  data.filter((team) =>
                    checked.East && checked.West
                      ? team.division && team.conference && team.city
                      : checked.East
                      ? team.conference === checked.East
                      : checked.West
                      ? team.conference === checked.West
                      : team.division && team.conference && team.city
                  ).length
                }{" "}
                teams
              </h1>
            )}
          </div>
          <div className="flex space-x-2">
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  onChange={(e) => handleChecked("East", e.target.checked)}
                  checked={checked.East !== ""}
                />
                <span className="md:px-4 md:py-2 py-1 px-2 text-sm dark:border-white dark:text-white hover:text-white text-gray-600 rounded-lg transition-all duration-300 peer-checked:bg-gray-500 peer-checked:text-white peer-checked:shadow-md peer-checked:scale-105 hover:bg-gray-400 border-gray-600 border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:ring-opacity-50">
                  Eastern
                </span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  onChange={(e) => handleChecked("West", e.target.checked)}
                  checked={checked.West !== ""}
                />
                <span className="md:px-4 md:py-2 py-1 px-2 text-sm dark:border-white dark:text-white hover:text-white text-gray-600 rounded-lg transition-all duration-300 peer-checked:bg-gray-500 peer-checked:text-white peer-checked:shadow-md peer-checked:scale-105 hover:bg-gray-400 border-gray-600 border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:ring-opacity-50">
                  Western
                </span>
              </label>
            </div>
          </div>
        </div>
        <div>
          {loading ? (
            <>
              <TeamsSkeleton />
            </>
          ) : data.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-3 overflow-x-hidden">
                {data
                  .filter((team) =>
                    checked.East && checked.West
                      ? team.division && team.conference && team.city
                      : checked.East
                      ? team.conference === checked.East
                      : checked.West
                      ? team.conference === checked.West
                      : team.division && team.conference && team.city
                  )
                  .map((team, index) => (
                    <div
                      key={team.id}
                      className="hover:scale-105 transition duration-300 ease-in-out"
                    >
                      <div
                        className="bg-white dark:bg-gray-800 dark:hover:bg-gray-500 shadow-md p-4 rounded-md transition duration-200 position-relative"
                        data-aos="zoom-in-left"
                      >
                        <div className="position-absolute">
                          <ConferenceLogo conferenceName={team.conference} />
                        </div>
                        <div>
                          <NbaLogo teamName={team.full_name} />
                        </div>
                        <h3 className="text-md font-semibold dark:text-white text-gray-500 text-center">
                          {team.full_name}
                        </h3>
                        <p className="text-center font-bold">
                          {team.abbreviation}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-white">
              No teams found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
