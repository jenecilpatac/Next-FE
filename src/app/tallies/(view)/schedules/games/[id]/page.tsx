"use client";

import api from "@/app/tallies/lib/axiosCall";
import formatDate from "@/app/tallies/utils/DateFormat";
import NbaLogo from "@/app/tallies/utils/NbaLogo";
import formatTime from "@/app/tallies/utils/TimeFormat";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

function GameSkeleton() {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-6 animate-pulse">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
            <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded mx-6" />
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4 mx-auto"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  const { id } = useParams();
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [intervalLoading, setIntervalLoading] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(
          `https://api.balldontlie.io/v1/games/${id}`,
        );
        setGameData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setIntervalLoading(false);
      }
    };

    fetchGame();
    const intervalId = setInterval(() => {
      setIntervalLoading(true);
      fetchGame();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) return <GameSkeleton />;

  const isLive =
    gameData?.status !== "Final" &&
    gameData?.status !== "Postponed" &&
    gameData?.status !== "Canceled";
  const status = gameData?.status ? getStatusBadge(gameData.status) : null;
  const homeWin =
    gameData?.status === "Final" &&
    gameData?.home_team_score > gameData?.visitor_team_score;
  const visitorWin =
    gameData?.status === "Final" &&
    gameData?.visitor_team_score > gameData?.home_team_score;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-3">
        {/* Back */}
        <Link
          href="/tallies/schedules"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Back to Schedules
        </Link>

        {/* Main card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <span className="text-sm font-bold text-blue-500 tracking-widest">
              NBA
            </span>
            <div className="flex items-center gap-2">
              {isLive && intervalLoading && (
                <span className="flex items-center gap-1.5 text-xs text-green-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              )}
              {status && (
                <span
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${status.cls}`}
                >
                  {status.label}
                </span>
              )}
            </div>
          </div>

          {/* Scoreboard */}
          <div className="px-6 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900">
            <div className="flex items-center justify-between gap-4">
              {/* Home team */}
              <div
                className={`flex flex-col items-center gap-2 flex-1 transition-opacity ${visitorWin ? "opacity-50" : ""}`}
              >
                <NbaLogo
                  teamName={gameData?.home_team?.full_name}
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center leading-snug">
                  {gameData?.home_team?.full_name}
                </p>
                <p
                  className={`text-4xl sm:text-5xl font-bold tabular-nums ${homeWin ? "text-blue-500" : "text-gray-900 dark:text-white"}`}
                >
                  {gameData?.home_team_score ?? "–"}
                </p>
                {homeWin && (
                  <span className="text-xs font-medium text-blue-500 flex items-center gap-1">
                    <i className="fa-solid fa-trophy text-yellow-500" /> Winner
                  </span>
                )}
              </div>

              {/* VS divider */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-lg font-bold text-gray-300 dark:text-gray-600">
                  VS
                </span>
                {gameData?.time && gameData.time !== null && (
                  <span
                    className={`text-xs text-gray-400 dark:text-gray-500 ${intervalLoading && isLive ? "animate-pulse" : ""}`}
                  >
                    {gameData.time}
                  </span>
                )}
              </div>

              {/* Visitor team */}
              <div
                className={`flex flex-col items-center gap-2 flex-1 transition-opacity ${homeWin ? "opacity-50" : ""}`}
              >
                <NbaLogo
                  teamName={gameData?.visitor_team?.full_name}
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center leading-snug">
                  {gameData?.visitor_team?.full_name}
                </p>
                <p
                  className={`text-4xl sm:text-5xl font-bold tabular-nums ${visitorWin ? "text-blue-500" : "text-gray-900 dark:text-white"}`}
                >
                  {gameData?.visitor_team_score ?? "–"}
                </p>
                {visitorWin && (
                  <span className="text-xs font-medium text-blue-500 flex items-center gap-1">
                    <i className="fa-solid fa-trophy text-yellow-500" /> Winner
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Game info strip */}
          <div className="border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
            <div className="flex flex-col items-center py-4 px-3 gap-1">
              <i className="fa-solid fa-calendar-days text-blue-500 text-sm" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white text-center">
                {formatDate(gameData?.date)}
              </p>
            </div>
            <div className="flex flex-col items-center py-4 px-3 gap-1">
              <i className="fa-solid fa-trophy text-blue-500 text-sm" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Season</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {gameData?.season}
              </p>
            </div>
            <div className="flex flex-col items-center py-4 px-3 gap-1">
              <i className="fa-solid fa-location-dot text-blue-500 text-sm" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Home</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white text-center">
                {gameData?.home_team?.city}
              </p>
            </div>
          </div>
        </div>

        {/* Team details cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { team: gameData?.home_team, label: "Home" },
            { team: gameData?.visitor_team, label: "Away" },
          ].map(({ team, label }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"
            >
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                {label}
              </p>
              <div className="flex items-center gap-3">
                <NbaLogo teamName={team?.full_name} className="w-10 h-10" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {team?.full_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-blue-500 font-bold">
                      {team?.abbreviation}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {team?.conference} Conf.
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400 dark:text-gray-500">Division</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {team?.division}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 dark:text-gray-500">City</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {team?.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
