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
          "Limit Reached"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (title: any) => (e: any) => {
    setFormInput((formInput: any) => ({
      ...formInput,
      [title]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/settings" className="text-gray-600 dark:text-gray-200">
          <span className="hover:border-b">
            <i className="fa-solid fa-arrow-left"></i> Back to settings
          </span>
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-6">
          Manage Password
        </h1>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6 border border-gray-300 dark:border-gray-500">
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            Ensure your account is secure by regularly updating your password.
            If you believe your account might be compromised, you should change
            your password here.
          </p>
          {!isNotOAuth && (
            <div className="flex gap-3 border border-yellow-500 items-center bg-yellow-400/15 text-yellow-300 mb-5 rounded-lg p-3">
              <i className="fa-solid fa-triangle-exclamation text-4xl"></i>
              <p>
                When logging in with Google or GitHub, your account is securely
                linked to your credentials from those services. As a result, you
                cannot change your password directly through this platform. If
                you wish to update your password, you’ll need to do so via your
                Google or GitHub account settings. This ensures that your login
                information remains consistent and secure across all platforms.
              </p>
            </div>
          )}
          <form onSubmit={isNotOAuth ? handleSubmit : undefined}>
            <Input
              disabled={!isNotOAuth}
              value={formInput.oldPassword}
              onChange={handleInputChange("oldPassword")}
              label="Current Password"
              type="password"
              placeholder="Enter Your current password"
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
              label="Confirm Password"
              type="password"
              placeholder="Enter confirm password"
              error={error.confirmNewPassword?.message}
            />
            <div className="flex justify-end">
              <Button
                disabled={!isNotOAuth}
                type="submit"
                label="Update Password"
                bgColor="blue-500"
                hoverBgColor="blue-600"
                icon="edit"
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
