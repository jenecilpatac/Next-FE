"use client";

import withAuth from "@/app/lib/withAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import Input from "../../components/inputs/Input";
import Select from "../../components/select/Select";
import { UserInfo } from "../../types/UserInfoTypes";
import { useAuth } from "@/app/context/AuthContext";
import { formatDate } from "date-fns";
import Button from "../../components/buttons/Button";
import useToastr from "../../hooks/Toastr";
import api from "@/app/lib/axiosCall";

const ManagePersonalInformation = () => {
  const { user, setIsRefresh }: any = useAuth();
  const { showSuccess, showError }: any = useToastr();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>("");
  const [formInput, setFormInput] = useState<UserInfo | any>({
    name: "",
    address: "",
    jobTitle: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    setFormInput({
      name: user.name || "",
      address: user.address || "",
      jobTitle: user.jobTitle || "",
      phoneNumber: user.phoneNumber || "",
      gender: user.gender || "",
      dateOfBirth: formatDate(user.dateOfBirth || new Date(), "yyyy-MM-dd"),
      email: user.email || "",
      username: user.username || "",
    });
  }, []);

  const handleInputChange = (title: any) => (e: any) => {
    setFormInput((prev: any) => ({ ...prev, [title]: e.target.value }));
  };

  const handleSubmitPersonalInformation = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRefresh(true);
    const { username, email, ...rest } = formInput;
    try {
      const response = await api.patch("settings/manage-personal-info", {
        ...rest,
      });
      if (response.status === 200) {
        setError("");
        showSuccess(response.data.message, "Success");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
      if (error.response.status === 429) {
        showError(
          "Update limit reached. Please try again after 24 hours.",
          "Limit Reached",
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
    }
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
            Personal Information
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep your profile details accurate and up to date.
          </p>
        </div>

        {/* Personal Details Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-address-book text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Personal Details
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your public profile information
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmitPersonalInformation}
            className="space-y-1"
          >
            <Input
              error={error?.name?.message}
              value={formInput.name}
              onChange={handleInputChange("name")}
              label="Name"
              type="text"
              placeholder="Enter your name"
            />
            <Input
              value={formInput.address}
              onChange={handleInputChange("address")}
              label="Address"
              type="text"
              placeholder="Enter your address"
              error={error?.address?.message}
            />
            <Input
              value={formInput.jobTitle}
              onChange={handleInputChange("jobTitle")}
              label="Job Title"
              type="text"
              placeholder="Enter your job title"
              error={error?.jobTitle?.message}
            />
            <Input
              value={formInput.phoneNumber}
              onChange={handleInputChange("phoneNumber")}
              label="Phone Number"
              type="text"
              placeholder="Enter your phone number"
              error={error?.phoneNumber?.message}
            />
            <Select
              value={formInput.gender}
              onChange={handleInputChange("gender")}
              label="Select Gender"
              error={error?.gender?.message}
            />
            <Input
              value={formInput.dateOfBirth}
              onChange={handleInputChange("dateOfBirth")}
              label="Date of Birth"
              type="date"
              placeholder="Enter your date of birth"
              error={error?.dateOfBirth?.message}
            />
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                label="Save Changes"
                bgColor="blue-600"
                hoverBgColor="blue-700"
                icon="floppy-disk"
                loadingText="Saving..."
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>

        {/* Login Details Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-key text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Login Details
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Username and email cannot be changed here.{" "}
                <Link
                  href="/settings/manage-password"
                  className="text-blue-500 hover:underline"
                >
                  Manage password
                </Link>
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Input
              value={formInput.username}
              onChange={handleInputChange("username")}
              disabled
              label="Username"
              type="text"
              placeholder="Enter your username"
              error={error?.username?.message}
            />
            <Input
              value={formInput.email}
              onChange={handleInputChange("email")}
              disabled
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={error?.email?.message}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ManagePersonalInformation);
