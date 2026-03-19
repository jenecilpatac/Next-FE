"use client";

import withAuth from "@/app/lib/withAuth";
import Link from "next/link";
import { useState } from "react";

const Settings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoginHistoryVisible, setIsLoginHistoryVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account preferences and security
          </p>
        </div>

        {/* Profile & Security */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-user text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Profile Information &amp; Security
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your personal details and login credentials.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/settings/manage-personal-information"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <i className="fa-solid fa-address-book" />
                  Manage Profile
                </Link>
                <Link
                  href="/settings/manage-password"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <i className="fa-solid fa-shield" />
                  Manage Password
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-lock text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Two-Factor Authentication
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  is2FAEnabled
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {is2FAEnabled ? "Enabled" : "Disabled"}
              </span>
              <button
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
                  is2FAEnabled
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {is2FAEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>

        {/* Account Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-chart-line text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Account Activity
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View devices and sessions currently logged into your account.
              </p>
            </div>
            <button
              onClick={() => alert("No function yet")}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              View Activity
            </button>
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-clock-rotate-left text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Login History
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monitor login history for any suspicious activity.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isLoginHistoryVisible
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {isLoginHistoryVisible ? "Visible" : "Hidden"}
              </span>
              <button
                onClick={() => setIsLoginHistoryVisible(!isLoginHistoryVisible)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                {isLoginHistoryVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-lightbulb text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Security Tips
              </h2>
              <ul className="space-y-2">
                {[
                  "Use a unique and strong password for your account.",
                  "Enable two-factor authentication for added security.",
                  "Monitor your account activity regularly.",
                  "Log out from public or shared computers after use.",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <i className="fa-solid fa-circle-check text-green-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Settings);
