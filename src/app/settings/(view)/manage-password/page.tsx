"use client";

import withAuth from "@/app/lib/withAuth";
import Link from "next/link";
import Input from "../../components/inputs/Input";
import Button from "../../components/buttons/Button";
import { useState } from "react";
import api from "@/app/lib/axiosCall";
import useToastr from "../../hooks/Toastr";
import { useAuth } from "@/app/context/AuthContext";

const ManagePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState<any>("");
  const { showSuccess, showError } = useToastr();
  const { user }: any = useAuth();

  const isNotOAuth = user?.provider === null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.patch("/settings/manage-password", {
        ...formInput,
      });
      if (response.status === 200) {
        setFormInput({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setError("");
        showSuccess(response.data.message, "Success");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
      if (error.response.status === 429) {
        showError(
          "Password update limit reached. Please try again after 24 hours.",
          "Limit Reached",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (title: any) => (e: any) => {
    setFormInput((prev: any) => ({ ...prev, [title]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {/* Back link */}
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <i className="fa-solid fa-arrow-left" />
          Back to Settings
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Manage Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep your account secure by updating your password regularly.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-shield text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Change Password
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update your login credentials
              </p>
            </div>
          </div>

          {!isNotOAuth && (
            <div className="flex gap-3 items-start bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-xl p-4 mb-5">
              <i className="fa-solid fa-triangle-exclamation text-lg shrink-0 mt-0.5" />
              <p className="text-sm">
                Your account is linked to Google or GitHub. To update your
                password, please do so through your provider's account settings.
              </p>
            </div>
          )}

          <form
            onSubmit={isNotOAuth ? handleSubmit : undefined}
            className="space-y-1"
          >
            <Input
              disabled={!isNotOAuth}
              value={formInput.oldPassword}
              onChange={handleInputChange("oldPassword")}
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              error={error.oldPassword?.message}
            />
            <Input
              disabled={!isNotOAuth}
              value={formInput.newPassword}
              onChange={handleInputChange("newPassword")}
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              error={error.newPassword?.message}
            />
            <Input
              disabled={!isNotOAuth}
              value={formInput.confirmNewPassword}
              onChange={handleInputChange("confirmNewPassword")}
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              error={error.confirmNewPassword?.message}
            />
            <div className="flex justify-end pt-2">
              <Button
                disabled={!isNotOAuth}
                type="submit"
                label="Update Password"
                bgColor="blue-600"
                hoverBgColor="blue-700"
                icon="lock"
                isLoading={isLoading}
                loadingText="Updating..."
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ManagePassword);
