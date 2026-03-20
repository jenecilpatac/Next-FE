"use client";

import Link from "next/link";
import useFetch from "../../hooks/fetchData";
import { useEffect, useState } from "react";
import NbaLogo from "../../utils/NbaLogo";
import YearSelect from "../../utils/YearDate";
import SchedulesSkeleton from "../../components/loaders/SchedulesSkeleton";
import OptionPerPage from "../../components/PerPage/OptionPerPage";
import formatDate from "../../utils/DateFormat";
import formatTime from "../../utils/TimeFormat";
import { format, subDays } from "date-fns";

const inputClass =
  "mt-1 px-3 py-2 w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

function getStatusBadge(status: string) {
  if (status === "Final")
    return {
      label: "Final",
      cls: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    };
  if (status === "Postponed")
    return {
      label: "Postponed",
      cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    };
  if (status === "Canceled")
    return {
      label: "Canceled",
      cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    };
  if (["1st Qtr", "2nd Qtr", "3rd Qtr", "4th Qtr"].includes(status))
    return {
      label: status,
      cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    };
  return {
    label: formatTime(status),
    cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };
}

export default function SchedulesPage() {
  const today = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const tomorrow = format(new Date(), "yyyy-MM-dd");

  const [selectedDate, setSelectedDate] = useState({
    startDate: "",
    endDate: "",
    year: "",
  });
  const [filteredData, setFilteredData] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [isPickedFilter, setIsPickedFilter] = useState({
    dates: false,
    years: false,
  });
  const [perPage, setPerPage] = useState(25);

  const { data, buttonLoading, error, meta } = useFetch(
    filteredData === ""
      ? `https://api.balldontlie.io/v1/games?dates[]=${today}&dates[]=${today}&per_page=100`
      : filteredData,
  );

  useEffect(() => {
    if (cursor) handleFilter();
  }, [cursor]);
  useEffect(() => {
    if (data) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [data]);

  const handleFilter = () => {
    if (isPickedFilter.dates) {
      setFilteredData(
        `https://api.balldontlie.io/v1/games?dates[]=${selectedDate.startDate && format(subDays(selectedDate.startDate, 1), "yyyy-MM-dd")}&dates[]=${selectedDate.endDate && format(subDays(selectedDate.endDate, 1), "yyyy-MM-dd")}&&per_page=${perPage}${cursor ? `&cursor=${cursor}` : ""}`,
      );
    } else if (isPickedFilter.years) {
      setFilteredData(
        `https://api.balldontlie.io/v1/games?seasons[]=${selectedDate.year}&&per_page=${perPage}${cursor ? `&cursor=${cursor}` : ""}`,
      );
    }
  };

  const handlePickedFilter = (name: "dates" | "years") => {
    setIsPickedFilter({ dates: name === "dates", years: name === "years" });
    setSelectedDate({ startDate: "", endDate: "", year: "" });
    setFilteredData("");
    setCursor(null);
    setPerPage(25);
  };

  return (
    <div className="p-3 space-y-4">
      {/* Filter card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-filter text-blue-500" /> Filter Games
          </h2>
          <Link
            href="/tallies"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-all"
          >
            <i className="fa-solid fa-arrow-left" /> Back
          </Link>
        </div>

        {/* Filter type selector */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {(["dates", "years"] as const).map((type) => (
            <label key={type} className="cursor-pointer">
              <input
                type="radio"
                checked={isPickedFilter[type]}
                onChange={() => handlePickedFilter(type)}
                className="hidden peer"
              />
              <div className="flex items-center justify-between p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-500/10 transition-all duration-200">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {type === "dates" ? "By Date" : "By Season"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {type === "dates"
                      ? "Filter by date range"
                      : "Filter by season year"}
                  </p>
                </div>
                <i
                  className={`fa-solid ${type === "dates" ? "fa-calendar" : "fa-calendar-days"} text-lg ${isPickedFilter[type] ? "text-blue-500" : "text-gray-400"}`}
                />
              </div>
            </label>
          ))}
        </div>

        {/* Date filter inputs */}
        {isPickedFilter.dates && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={selectedDate.startDate}
                onChange={(e) =>
                  setSelectedDate({
                    ...selectedDate,
                    startDate: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={selectedDate.endDate}
                onChange={(e) =>
                  setSelectedDate({ ...selectedDate, endDate: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Per Page
              </label>
              <select
                className={inputClass}
                onChange={(e: any) => setPerPage(e.target.value)}
              >
                <OptionPerPage />
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                disabled={buttonLoading}
                className="w-full py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {buttonLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin" />{" "}
                    Filtering...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass" /> Search
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Year filter inputs */}
        {isPickedFilter.years && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Season Year
              </label>
              <select
                className={inputClass}
                onChange={(e) =>
                  setSelectedDate({ ...selectedDate, year: e.target.value })
                }
              >
                <option hidden value="">
                  Select year
                </option>
                <YearSelect />
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Per Page
              </label>
              <select
                className={inputClass}
                onChange={(e: any) => setPerPage(e.target.value)}
              >
                <OptionPerPage />
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                disabled={buttonLoading}
                className="w-full py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {buttonLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin" />{" "}
                    Filtering...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass" /> Search
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        {data.length > 0 && (
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
            <span className="text-blue-500 font-semibold">{data.length}</span>{" "}
            games found
          </p>
        )}

        {buttonLoading ? (
          <SchedulesSkeleton />
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <i className="fa-solid fa-calendar-xmark text-2xl text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
              {!filteredData
                ? "Select a filter above to see games"
                : selectedDate.startDate && selectedDate.endDate
                  ? `No games found between ${selectedDate.startDate} and ${selectedDate.endDate}`
                  : selectedDate.year
                    ? `No games found for ${selectedDate.year} season`
                    : "No games found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((game: any) => {
              const status = getStatusBadge(game.status);
              const dateLabel =
                game.date === today
                  ? "Today"
                  : game.date === yesterday
                    ? "Yesterday"
                    : game.date === tomorrow
                      ? "Tomorrow"
                      : formatDate(game.date);
              return (
                <Link
                  key={game.id}
                  href={`/tallies/schedules/games/${game.id}`}
                >
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/50 transition-all duration-200 cursor-pointer">
                    {/* Score */}
                    <p className="text-center text-sm font-bold text-gray-900 dark:text-white mb-3">
                      {game.home_team.abbreviation}{" "}
                      <span className="text-blue-500">
                        {game.home_team_score}
                      </span>
                      <span className="text-gray-400 mx-1">–</span>
                      <span className="text-blue-500">
                        {game.visitor_team_score}
                      </span>{" "}
                      {game.visitor_team.abbreviation}
                    </p>

                    {/* Logos */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <NbaLogo teamName={game.home_team.full_name} />
                      <span className="text-xs font-bold text-gray-400">
                        VS
                      </span>
                      <NbaLogo teamName={game.visitor_team.full_name} />
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 text-center space-y-1.5">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {game.season} Season
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dateLabel}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${status.cls}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {data.length > 0 && meta?.next_cursor && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCursor(meta.next_cursor)}
              disabled={buttonLoading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg active:scale-95 transition-all disabled:opacity-60"
            >
              {buttonLoading ? (
                <i className="fa-solid fa-spinner animate-spin" />
              ) : (
                <>
                  <span>Next Page</span>
                  <i className="fa-solid fa-arrow-right" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
