"use client";

import api from "@/app/lib/axiosCall";
import withOutAuth from "@/app/lib/withOutAuth";
import { ValidationErrors } from "@/app/types/ValidationType";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import Input from "../components/inputs/Input";
import Button from "../components/buttons/Button";

const Register = () => {
  const [flashError, setFlashError] = useState("");
  const [error, setError] = useState<ValidationErrors | any>("");
  const [formInput, setFormInput] = useState({
    email: "",
    name: "",
    username: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: string) => (e: any) =>
    setFormInput((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/register", { ...formInput });
      if (response.status === 201) {
        setError("");
        setFormInput({
          email: "",
          name: "",
          username: "",
          address: "",
          phoneNumber: "",
          dateOfBirth: "",
          password: "",
          confirmPassword: "",
        });
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#3b82f6",
          html: "You have successfully registered. Click below to sign in.",
        }).then((result) => {
          if (result.isConfirmed) router.push("/login");
        });
      } else {
        setFlashError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data);
      if (error.message === "Network Error")
        setFlashError(`${error.message} or server error.`);
      if (error.response?.status === 429)
        setFlashError(`${error.response.statusText}. Please try again later.`);
      if (error.response?.status === 400) setFlashError("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-8"
      style={{
        backgroundImage:
          'url("https://t4.ftcdn.net/jpg/08/94/02/21/360_F_894022146_cOoOtPF24XRZixcpnlojDhjZftU3p8dH.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
              <img
                src="https://cdn-icons-png.flaticon.com/128/2065/2065254.png"
                className="h-4 w-4 brightness-0 invert"
                alt="Blog App"
              />
            </div>
            <span className="text-white font-semibold">Blog App</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">
            Create an account
          </h1>
          <p className="text-sm text-gray-300 mb-6">
            Fill in your details to get started
          </p>

          {/* Alert */}
          {flashError && (
            <div className="flex items-start gap-3 px-4 py-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
              <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0" />
              <span className="flex-1">{flashError}</span>
              <button
                onClick={() => setFlashError("")}
                className="shrink-0 hover:text-red-200"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Two-column grid for short fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                icon="envelope"
                error={error?.email?.message}
                type="email"
                onChange={handleChange("email")}
                value={formInput.email}
                id="email"
                placeholder="Email"
              />
              <Input
                icon="user"
                error={error?.name?.message}
                type="text"
                onChange={handleChange("name")}
                value={formInput.name}
                id="name"
                placeholder="Full name"
              />
              <Input
                icon="at"
                error={error?.username?.message}
                type="text"
                onChange={handleChange("username")}
                value={formInput.username}
                id="username"
                placeholder="Username"
              />
              <Input
                icon="phone"
                error={error?.phoneNumber?.message}
                type="text"
                onChange={handleChange("phoneNumber")}
                value={formInput.phoneNumber}
                id="phoneNumber"
                placeholder="Phone number"
              />
              <Input
                icon="calendar"
                error={error?.dateOfBirth?.message}
                type="date"
                onChange={handleChange("dateOfBirth")}
                value={formInput.dateOfBirth}
                id="dateOfBirth"
                placeholder="Date of birth"
              />
              <Input
                icon="location-dot"
                error={error?.address?.message}
                type="text"
                onChange={handleChange("address")}
                value={formInput.address}
                id="address"
                placeholder="Address"
              />
            </div>

            {/* Password fields full width */}
            <Input
              icon="lock"
              error={error?.password?.message}
              type="password"
              onChange={handleChange("password")}
              value={formInput.password}
              id="password"
              placeholder="Password"
            />
            <Input
              icon="lock"
              error={error?.confirmPassword?.message}
              type="password"
              onChange={handleChange("confirmPassword")}
              value={formInput.confirmPassword}
              id="confirmPassword"
              placeholder="Confirm password"
            />

            <Button
              type="submit"
              loadingText="Creating account..."
              label="Create Account"
              isLoading={loading}
            />
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withOutAuth(Register);
