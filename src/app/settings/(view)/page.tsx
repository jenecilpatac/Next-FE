"use client";

import withAuth from "@/app/lib/withAuth";
import Link from "next/link";
import { useState } from "react";

const Settings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoginHistoryVisible, setIsLoginHistoryVisible] = useState(false);

  const toggle2FA = () => setIs2FAEnabled(!is2FAEnabled);
  const toggleLoginHistory = () =>
    setIsLoginHistoryVisible(!isLoginHistoryVisible);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Settings
        </h1>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6 border border-gray-300 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Profile Information and Security
          </h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            This section gives you full control over your personal information
            and login settings, helping you maintain both convenience and
            security on our platform. Keeping these details up-to-date and
            secure is essential to ensure your account remains safe and
            accessible.
          </p>
          <div className="flex justify-end items-center">
            <div className="flex flex-col space-y-5">
              <Link
                href="/settings/manage-personal-information"
                className="text-end hover:scale-105"
              >
                <span className="px-4 py-2 rounded-md text-white bg-sky-500 hover:bg-sky-600 focus:outline-none">
                  <i className="fa-solid fa-address-book"></i> Manage Profile
                  Information
                </span>
              </Link>
              <Link
                href="/settings/manage-password"
                className="text-end hover:scale-105"
              >
                <span className="px-4 py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none">
                  <i className="fa-solid fa-shield"></i> Manage Password
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6 border border-gray-300 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Two-Factor Authentication (2FA)
          </h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            Enhance the security of your account by requiring a second form of
            authentication when logging in.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-100">
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={toggle2FA}
              className={`px-4 py-2 rounded-md text-white hover:scale-105 ${
                is2FAEnabled
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } focus:outline-none`}
            >
              {is2FAEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6 border border-gray-300 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Account Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            View the devices and sessions currently logged into your account.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-100">
              View your activity
            </span>
            <button
              onClick={() => alert("No function yet")}
              className="px-4 py-2 rounded-md text-white hover:scale-105 bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
            >
              View Activity
            </button>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6 border border-gray-300 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Login History
          </h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            Monitor the login history of your account for any suspicious
            activities.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-100">
              {isLoginHistoryVisible ? "Visible" : "Not Visible"}
            </span>
            <button
              onClick={toggleLoginHistory}
              className="px-4 py-2 rounded-md text-white hover:scale-105 bg-gray-500 hover:bg-gray-400 focus:outline-none"
            >
              {isLoginHistoryVisible ? "Hide History" : "Show History"}
            </button>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Security Tips
          </h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-200">
            <li>Use a unique and strong password for your account.</li>
            <li>Enable two-factor authentication for added security.</li>
            <li>Monitor your account activity regularly.</li>
            <li>Log out from public or shared computers after use.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Settings);
