"use client";

import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import withAuth from "../lib/withAuth";
import useFetch from "./hooks/fetchData";
import { useEffect, useState } from "react";
import useSocket from "../chats/hooks/useSocket";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const { data, loading }: any = useFetch("/dashboard", false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const dashboardData = {
    posts: data.postCounts,
    likes: data.likeCounts,
    comments: data.commentCounts,
    shares: 500,
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Posts Growth",
        data: [10, 20, 30, 15, 13, 56],
        fill: false,
        borderColor: "#3498db",
        tension: 0.1,
      },
      {
        label: "Likes Growth",
        data: [5, 10, 15, 67, 25, 25],
        fill: false,
        borderColor: "#e74c3c",
        tension: 0.1,
      },
      {
        label: "Comments Growth",
        data: [3, 6, 90, 29, 15, 18],
        fill: false,
        borderColor: "#f1c40f",
        tension: 0.1,
      },
      {
        label: "Shares Growth",
        data: [10, 67, 190, 39, 125, 222],
        fill: false,
        borderColor: "#3429e1",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Posts Distribution",
        data: [15, 20, 25, 30, 35, 40],
        backgroundColor: "#3498db",
        borderColor: "#2980b9",
        borderWidth: 1,
      },
      {
        label: "Likes Distribution",
        data: [5, 10, 15, 20, 25, 30],
        backgroundColor: "#e74c3c",
        borderColor: "#c0392b",
        borderWidth: 1,
      },
      {
        label: "Comments Distribution",
        data: [2, 4, 8, 12, 18, 22],
        backgroundColor: "#f1c40f",
        borderColor: "#f39c12",
        borderWidth: 1,
      },
      {
        label: "Shares Distribution",
        data: [5, 2, 4, 20, 150, 222],
        backgroundColor: "#3429e1",
        borderColor: "#3434e6",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 hover:bg-gray-200 p-6 rounded-lg shadow-md flex justify-between items-center hover:scale-105 transition duration-300 ease-in-out">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Posts
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <>
                  <i className="fa-solid fa-fan animate-spin text-3xl"></i>
                </>
              ) : (
                dashboardData.posts
              )}
            </p>
          </div>
          <div className="text-6xl text-blue-500">
            <i className="fa-solid text-6xl fa-sign"></i>
          </div>
        </div>

        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 hover:bg-gray-200 p-6 rounded-lg shadow-md flex justify-between items-center hover:scale-105 transition duration-300 ease-in-out">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Likes
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <>
                  <i className="fa-solid fa-fan animate-spin text-3xl"></i>
                </>
              ) : (
                dashboardData.likes
              )}
            </p>
          </div>
          <div className="text-6xl text-pink-500">
            <i className="fa-solid text-6xl fa-thumbs-up"></i>
          </div>
        </div>

        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 hover:bg-gray-200 p-6 rounded-lg shadow-md flex justify-between items-center hover:scale-105 transition duration-300 ease-in-out">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Comments
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <>
                  <i className="fa-solid fa-fan animate-spin text-3xl"></i>
                </>
              ) : (
                dashboardData.comments
              )}
            </p>
          </div>
          <div className="text-6xl text-green-500">
            <i className="fa-solid text-6xl fa-comment"></i>
          </div>
        </div>
        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 hover:bg-gray-200 p-6 rounded-lg shadow-md flex justify-between items-center hover:scale-105 transition duration-300 ease-in-out">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Shares
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {dashboardData.shares}
            </p>
          </div>
          <div className="text-6xl text-violet-500">
            <i className="fa-solid text-6xl fa-share"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Posts Growth Over Time
          </h3>
          <Line data={lineChartData} />
        </div>

        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Posts, Likes, Comments and Shares Distribution
          </h3>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
