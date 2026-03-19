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

export default function page() {
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
  const { data, buttonLoading, error, meta } = useFetch(
    filteredData === ""
      ? `https://api.balldontlie.io/v1/games?dates[]=${today}&dates[]=${today}&per_page=100`
      : filteredData
  );
  const [isPickedFilter, setIsPickedFilter] = useState<{
    dates: boolean;
    years: boolean;
  }>({
    dates: false,
    years: false,
  });
  const [perPage, setPerPage] = useState(25);

  useEffect(() => {
    if (cursor) {
      handleFilter();
    }

    if (data) {
      scrollToTop();
    }
  }, [cursor, data]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFilter = () => {
    if (isPickedFilter.dates === true) {
      const data = `https://api.balldontlie.io/v1/games?dates[]=${
        selectedDate.startDate && format(subDays(selectedDate.startDate, 1), "yyyy-MM-dd")
      }&dates[]=${selectedDate.endDate && format(subDays(selectedDate.endDate, 1), "yyyy-MM-dd")}&&per_page=${perPage}${
        cursor ? `&cursor=${cursor}` : ""
      }`;
      setFilteredData(data);
    } else if (isPickedFilter.years === true) {
      const data = `https://api.balldontlie.io/v1/games?seasons[]=${
        selectedDate.year
      }&&per_page=${perPage}${cursor ? `&cursor=${cursor}` : ""}`;
      setFilteredData(data);
    } else {
      return console.error(error);
    }
  };
  const handlePickedFilter = (name: "dates" | "years") => {
    setIsPickedFilter({
      dates: name === "dates",
      years: name === "years",
    });

    setSelectedDate({
      startDate: "",
      endDate: "",
      year: "",
    });
    setFilteredData("");
    setCursor(null);
    setPerPage(25);
  };

  const handlePerPage = (e: any) => {
    setPerPage(e.target.value);
  };

  const handleNextPage = () => {
    if (meta?.next_cursor) {
      setCursor(meta?.next_cursor);
    }
  };
  return (
    <div className="mt-2 p-2">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-5">
        <div className="flex justify-center mb-5 w-full">
          <Link
            href={"/tallies"}
            className="px-3 py-3 text-sm text-white hover:scale-105 bg-blue-600 rounded-lg shadow hover:bg-blue-800 hover:text-white transition"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Tallies
          </Link>
        </div>
        <ul className="grid w-full gap-6 md:grid-cols-2 mb-5">
          <li>
            <input
              type="radio"
              id="dates"
              checked={isPickedFilter.dates}
              onChange={() => handlePickedFilter("dates")}
              className="hidden peer"
              required
            />
            <label
              htmlFor="dates"
              className="inline-flex items-center justify-between w-full p-5 text-gray-800 dark:text-white bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="block">
                <div className="w-full text-lg font-semibold">Date</div>
                <div className="w-full">Filter as date</div>
              </div>
              <i className="fa-solid fa-calendar w-5 h-5"></i>
            </label>
          </li>
          <li>
            <input
              type="radio"
              id="years"
              checked={isPickedFilter.years}
              onChange={() => handlePickedFilter("years")}
              className="hidden peer"
            />
            <label
              htmlFor="years"
              className="inline-flex items-center justify-between w-full p-5 text-gray-800 dark:text-white bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="block">
                <div className="w-full text-lg font-semibold">Year</div>
                <div className="w-full">Filter as year</div>
              </div>
              <i className="fa-solid fa-calendar w-5 h-5"></i>
            </label>
          </li>
        </ul>
        {isPickedFilter.dates && (
          <div>
            <h1 className="md:text-3xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
              Select date of the game
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  onChange={(e) =>
                    setSelectedDate({
                      ...selectedDate,
                      startDate: e.target.value,
                    })
                  }
                  value={selectedDate.startDate}
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  onChange={(e) =>
                    setSelectedDate({
                      ...selectedDate,
                      endDate: e.target.value,
                    })
                  }
                  value={selectedDate.endDate}
                  className="mt-1 px-4 py-2 w-full border border-gray-300 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="perPage"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Select Per Page
                </label>
                <select
                  className="mt-1 px-4 py-2.5 w-full border text-gray-900 dark:text-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handlePerPage}
                >
                  <OptionPerPage />
                </select>
              </div>

              <div>
                <button
                  type="button"
                  disabled={buttonLoading}
                  onClick={handleFilter}
                  className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition duration-200 hover:scale-105"
                >
                  {buttonLoading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>{" "}
                      Filtering...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-calendar"></i> Filter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {isPickedFilter.years && (
          <div>
            <h1 className="md:text-3xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
              Select year of the game
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Select year
                </label>
                <select
                  className="mt-1 px-4 py-2 w-full border text-gray-900 dark:text-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setSelectedDate({
                      ...selectedDate,
                      year: e.target.value,
                    })
                  }
                >
                  <option hidden defaultValue="">
                    Select year
                  </option>
                  <option disabled>Select year</option>
                  <YearSelect />
                </select>
              </div>

              <div>
                <label
                  htmlFor="perPage"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Select Per Page
                </label>
                <select
                  className="mt-1 px-4 py-2 w-full border text-gray-900 dark:text-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handlePerPage}
                >
                  <OptionPerPage />
                </select>
              </div>

              <div>
                <button
                  type="button"
                  disabled={buttonLoading}
                  onClick={handleFilter}
                  className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition duration-200 hover:scale-105"
                >
                  {buttonLoading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>{" "}
                      Filtering...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-calendar"></i> Filter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg shadow-md p-5 bg-white dark:bg-gray-900 mt-3 h-full">
        {data.length !== 0 && (
          <h2 className="text-xl text-gray-600 mb-6 dark:text-white">
            Results: {data.length}
          </h2>
        )}
        <div>
          {buttonLoading ? (
            <SchedulesSkeleton />
          ) : (
            <div>
              {data.length === 0 ? (
                <div className="flex items-center justify-center h-72">
                  <div className="text-center">
                    <i className="fa-solid fa-calendar-times text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                    <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                      {!filteredData
                        ? "Filter date first to see results"
                        : selectedDate.startDate && selectedDate.endDate
                        ? `No game found between ${selectedDate.startDate} and ${selectedDate.endDate}`
                        : selectedDate.year
                        ? `No game in year ${selectedDate.year}`
                        : "Filter date first to see results"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-3 overflow-x-hidden">
                  {data.map((game, index) => (
                    <div
                      key={game.id}
                      className="hover:scale-105 transition duration-300 ease-in-out"
                    >
                      <Link href={`/tallies/schedules/games/${game.id}`}>
                        <div
                          data-aos="zoom-in-left"
                          className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-md hover:z-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"
                        >
                          <h3 className="text-xl font-semibold dark:text-white text-center text-gray-500">
                            {game.home_team.abbreviation} {game.home_team_score}{" "}
                            - {game.visitor_team.abbreviation}{" "}
                            {game.visitor_team_score}
                          </h3>
                          <div className="flex space-x-2 items-center">
                            <div>
                              <NbaLogo teamName={game.home_team.full_name} />
                            </div>
                            <h3 className="text-4xl font-semibold dark:text-white">
                              <strong>VS</strong>
                            </h3>
                            <div>
                              <NbaLogo teamName={game.visitor_team.full_name} />
                            </div>
                          </div>
                          <hr />
                          <div className="text-center my-5">
                            <p className="text-2xl font-semibold mb-3 dark:text-white text-gray-800">
                              {game.season}
                            </p>
                            <p className="dark:text-white text-gray-800">
                              {game.date === today
                                ? "Today"
                                : game.date === yesterday
                                ? "Yesterday"
                                : game.date === tomorrow
                                ? "Tomorrow"
                                : formatDate(game.date)}
                            </p>
                            <p className="dark:text-white text-xs text-gray-800">
                              {game.status === "Final"
                                ? "Game is finished"
                                : game.status === "Postponed"
                                ? "Game is postponed"
                                : game.status === "Canceled"
                                ? "Game is canceled"
                                : game.status === "1st Qtr" ||
                                  game.status === "2nd Qtr" ||
                                  game.status === "3rd Qtr" ||
                                  game.status === "4th Qtr"
                                ? game.status
                                : formatTime(game.status)}
                            </p>
                            <p className="dark:text-white text-xs text-gray-800">
                              {game.time === null
                                ? "Game is not started"
                                : game.time}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {data.length !== 0 && meta.next_cursor && (
            <div className="flex justify-center">
              <button
                type="button"
                disabled={buttonLoading}
                onClick={handleNextPage}
                className="mt-6 bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition duration-200 hover:scale-105"
              >
                {buttonLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  </>
                ) : (
                  <>
                    Next Page <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
