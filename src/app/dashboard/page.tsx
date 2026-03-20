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
  Legend,
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

  const statCards = [
    {
      label: "Posts",
      value: dashboardData.posts,
      icon: "fa-sign",
      color: "blue",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      loading,
    },
    {
      label: "Likes",
      value: dashboardData.likes,
      icon: "fa-thumbs-up",
      color: "pink",
      bg: "bg-pink-50 dark:bg-pink-900/20",
      text: "text-pink-600 dark:text-pink-400",
      loading,
    },
    {
      label: "Comments",
      value: dashboardData.comments,
      icon: "fa-comment",
      color: "green",
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
      loading,
    },
    {
      label: "Shares",
      value: dashboardData.shares,
      icon: "fa-share",
      color: "violet",
      bg: "bg-violet-50 dark:bg-violet-900/20",
      text: "text-violet-600 dark:text-violet-400",
      loading: false,
    },
  ];

  return (
    <div className="min-h-screen p-6 dark:bg-black">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Overview of your blog activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {card.loading ? (
                  <i className="fa-solid fa-spinner animate-spin text-2xl text-gray-300"></i>
                ) : (
                  (card.value ?? 0)
                )}
              </p>
            </div>
            <div
              className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center`}
            >
              <i className={`fa-solid ${card.icon} text-2xl ${card.text}`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Growth Over Time
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Posts, likes, comments & shares
          </p>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Distribution
          </h3>
          <p className="text-xs text-gray-400 mb-4">Monthly breakdown</p>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
