"use client";

import api from "@/app/tallies/lib/axiosCall";
import formatDate from "@/app/tallies/utils/DateFormat";
import NbaLogo from "@/app/tallies/utils/NbaLogo";
import formatTime from "@/app/tallies/utils/TimeFormat";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const { id } = useParams();
  const [gameData, setGameData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [intervalLoading, setIntervalLoading] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(
          `https://api.balldontlie.io/v1/games/${id}`
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

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div>
          <div className="mb-2">
            <Link
              href="/tallies/schedules"
              className="font-semibold py-2 px-4 rounded hover:text-blue-600"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Schedules
            </Link>
          </div>
          <div className="p-5 max-w-xl rounded shadow-xl dark:bg-gray-900 bg-gray-50">
            <div className="flex justify-between mb-2 items-center">
              <p className="text-3xl text-blue-600 font-bold">NBA</p>
              <p
                className={`dark:text-white text-sm text-gray-800 ${
                  intervalLoading &&
                  gameData?.status !== "Final" &&
                  "animate-flip-top-blur"
                }`}
              >
                {gameData?.time === null
                  ? "Game is not started"
                  : gameData?.time}
              </p>
            </div>
            <hr />
            <p className="text-2xl font-semibold text-center mb-6 mt-3">
              {gameData?.home_team?.abbreviation}{" "}
              <span
                className={`${
                  intervalLoading && gameData?.status !== "Final" &&
                  gameData?.home_team_score
                    ? "border-b"
                    : ""
                } `}
              >
                <span className="text-2xl">{gameData?.home_team_score}</span>
              </span>{" "}
              - {gameData?.visitor_team?.abbreviation}{" "}
              <span
                className={`${
                  intervalLoading && gameData?.status !== "Final" &&
                  gameData?.visitor_team_score
                    ? "border-b"
                    : ""
                } `}
              >
                <span className="text-2xl">{gameData?.visitor_team_score}</span>
              </span>
            </p>
            <div className="flex space-x-2 items-center">
              <div>
                <NbaLogo teamName={gameData?.home_team?.full_name} />
                <p className="text-center mb-3 text-1xl font-semibold">
                  {gameData?.home_team?.full_name}
                </p>
              </div>
              <h3 className="text-4xl font-semibold dark:text-white">
                <strong>VS</strong>
              </h3>
              <div>
                <NbaLogo teamName={gameData?.visitor_team?.full_name} />
                <p className="text-center mb-3 text-1xl font-semibold">
                  {gameData?.visitor_team?.full_name}
                </p>
              </div>
            </div>
            <hr />
            <div className="text-center my-5">
              <p className="text-2xl font-semibold mb-3 dark:text-white text-gray-800">
                {gameData?.season}
              </p>
              <p className="dark:text-white text-gray-800">
                {!loading && formatDate(gameData?.date)}
              </p>
              <p className="dark:text-white text-xs text-gray-800">
                {gameData?.status === "Final"
                  ? "Game is finished"
                  : gameData?.status === "Postponed"
                  ? "Game is postponed"
                  : gameData?.status === "Canceled"
                  ? "Game is canceled"
                  : gameData?.status === "1st Qtr" ||
                    gameData?.status === "2nd Qtr" ||
                    gameData?.status === "3rd Qtr" ||
                    gameData?.status === "4th Qtr"
                  ? gameData?.status
                  : !loading && formatTime(gameData?.status)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
