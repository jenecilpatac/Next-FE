"use client";

import Link from "next/link";
import useFetch from "../../hooks/fetchData";
import NbaLogo from "../../utils/NbaLogo";
import ConferenceLogo from "../../utils/ConferenceLogo";
import { useState } from "react";
import TeamsSkeleton from "../../components/loaders/TeamsSkeleton";

export default function TeamsPage() {
  const [checked, setChecked] = useState({ East: "", West: "" });
  const { loading, data, setIsRefresh } = useFetch(
    "https://api.balldontlie.io/v1/teams",
  );

  const handleChecked = (name: string, isChecked: boolean) => {
    setChecked((prev) => ({ ...prev, [name]: isChecked ? name : "" }));
    setIsRefresh(true);
    setTimeout(() => setIsRefresh(false), 100);
  };

  const filtered = data.filter((team: any) =>
    checked.East && checked.West
      ? team.division && team.conference && team.city
      : checked.East
        ? team.conference === "East"
        : checked.West
          ? team.conference === "West"
          : team.division && team.conference && team.city,
  );

  return (
    <div className="p-3">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-people-group text-blue-500" />
              {checked.East && !checked.West
                ? "Eastern Conference"
                : checked.West && !checked.East
                  ? "Western Conference"
                  : "All NBA Teams"}
            </h1>
            {!loading && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span className="text-blue-500 font-semibold">
                  {filtered.length}
                </span>{" "}
                teams
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Conference toggles */}
            {(["East", "West"] as const).map((conf) => (
              <label key={conf} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  onChange={(e) => handleChecked(conf, e.target.checked)}
                  checked={checked[conf] !== ""}
                />
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all duration-200 cursor-pointer
                  border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400
                  peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:text-white"
                >
                  <i
                    className={`fa-solid ${conf === "East" ? "fa-e" : "fa-w"} text-xs`}
                  />
                  {conf}ern
                </span>
              </label>
            ))}

            <Link
              href="/tallies"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-all"
            >
              <i className="fa-solid fa-arrow-left" /> Back
            </Link>
          </div>
        </div>

        {/* Teams grid */}
        {loading ? (
          <TeamsSkeleton />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((team: any) => (
              <div
                key={team.id}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/50 transition-all duration-200 relative"
              >
                {/* Conference badge */}
                <div className="absolute top-2.5 right-2.5">
                  <ConferenceLogo conferenceName={team.conference} />
                </div>

                <div className="flex justify-center my-3">
                  <NbaLogo teamName={team.full_name} />
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-snug">
                    {team.full_name}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 rounded-full">
                    {team.abbreviation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <i className="fa-solid fa-people-group text-xl text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No teams found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
