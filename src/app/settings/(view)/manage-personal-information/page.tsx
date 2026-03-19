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
    setFormInput((formInput: any) => ({
      ...formInput,
      [title]: e.target.value,
    }));
  };

  const handleSubmitPersonalInformation = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRefresh(true);
    const { username, email, ...rest} = formInput;
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
          "Password update limit reached. Please try again after 24 hours.",
          "Limit Reached"
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/settings" className="text-gray-600 dark:text-gray-200">
          <span className="hover:border-b">
            <i className="fa-solid fa-arrow-left"></i> Back to settings
          </span>
        </Link>
        <h1 className="text-3xl mt-3 font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Manage Personal Information
        </h1>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6 border border-gray-300 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Personal Details
          </h2>
          <p className="text-gray-500 dark:text-gray-200 mb-4">
            Your personal details are key to ensuring your account stays secure
            and up to date. By maintaining accurate information, you can ensure
            that we can easily contact you regarding your{" "}
            <Link
              className="text-blue-500 hover:underline hover:text-blue-600"
              href="/profile"
            >
              account
            </Link>{" "}
            and keep everything running smoothly.
          </p>

          <form onSubmit={handleSubmitPersonalInformation}>
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
            <div className="flex justify-end">
              <Button
                type="submit"
                label="Save Changes"
                bgColor="blue-500"
                hoverBgColor="blue-600"
                icon="save"
                loadingText="Saving..."
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6 border border-gray-300 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Login Details
          </h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            Your login details play a critical role in the security of your
            account. By updating your{" "}
            <Link
              className="text-blue-500 hover:underline hover:text-blue-600"
              href="/settings/manage-password"
            >
              password
            </Link>{" "}
            regularly and keeping an eye on your login history, you can take
            steps to prevent unauthorized access and ensure your account remains
            safe.
          </p>
          <form>
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
            <div className="flex justify-end">
              <Button
                type="submit"
                label="Save Changes"
                bgColor="blue-500"
                disabled
                hoverBgColor="blue-600"
                icon="save"
                loadingText="Saving..."
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ManagePersonalInformation);
