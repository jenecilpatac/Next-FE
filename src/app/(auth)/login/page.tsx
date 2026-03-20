"use client";

import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/axiosCall";
import withOutAuth from "@/app/lib/withOutAuth";
import { ValidationErrors } from "@/app/types/ValidationType";
import Link from "next/link";
import { useEffect, useState } from "react";
import Input from "../components/inputs/Input";
import Button from "../components/buttons/Button";

const GoogleSVG = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#g)">
      <path
        d="M47.532 24.553C47.532 22.921 47.4 21.281 47.118 19.676H24.48V28.918H37.443c-.538 2.98-2.266 5.617-4.797 7.293v6.997h7.734C44.922 38.028 47.532 31.855 47.532 24.553Z"
        fill="#4285F4"
      />
      <path
        d="M24.48 48.002c6.473 0 11.932-2.125 15.909-5.794l-7.734-6.997c-2.152 1.464-4.93 2.293-8.166 2.293-6.261 0-11.57-4.224-13.475-9.903H3.033v6.182C7.107 42.887 15.406 48.002 24.48 48.002Z"
        fill="#34A853"
      />
      <path
        d="M11.005 28.601a13.17 13.17 0 0 1 0-8.189v-6.182H3.033a23.998 23.998 0 0 0 0 20.553l7.972-6.182Z"
        fill="#FBBC04"
      />
      <path
        d="M24.48 9.499c3.422-.047 6.729 1.24 9.207 3.604l6.852-6.852C36.2 2.171 30.441-.069 24.48.002c-9.075 0-17.373 5.115-21.447 13.228l7.972 6.182C12.9 13.724 18.219 9.499 24.48 9.499Z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="g">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const GithubSVG = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 -3.5 256 256"
    xmlns="http://www.w3.org/2000/svg"
    fill="#ffffff"
  >
    <path d="M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0" />
  </svg>
);

const Login = () => {
  const [formInput, setFormInput] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState<ValidationErrors | any>("");
  const [flashError, setFlashError] = useState("");
  const [flashSuccess, setFlashSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { login }: any = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("successVerification"))
      setFlashSuccess(params.get("successVerification")!);
    else if (params.has("errorVerification"))
      setFlashError(params.get("errorVerification")!);
    window.history.replaceState(null, "", "login");
  }, []);

  const handleInputChange = (field: string) => (e: any) =>
    setFormInput((prev) => ({ ...prev, [field]: e.target.value }));

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { ...formInput });
      if (response.data.statusCode === 200) {
        setError("");
        login(response.data.accessToken, response.data.rememberToken);
        setFormInput({ usernameOrEmail: "", password: "" });
      } else {
        setFlashError(response.data.message);
        setError("");
      }
    } catch (error: any) {
      setError(error?.response?.data || `${error.message} or server error.`);
      if (error.message === "Network Error")
        setFlashError(`${error.message} or server error.`);
      if (error.response?.status === 429)
        setFlashError(`${error.response.statusText}. Please try again later.`);
      if (error.response?.status === 400) {
        setFlashError("");
        setFlashSuccess("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{
        backgroundImage:
          'url("https://app.hub-analytics.com/assets/images/login-cover.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
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

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-300 mb-6">
            Sign in to your account to continue
          </p>

          {/* Alerts */}
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
          {flashSuccess && (
            <div className="flex items-start gap-3 px-4 py-3 mb-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm">
              <i className="fa-solid fa-circle-check mt-0.5 shrink-0" />
              <span className="flex-1">{flashSuccess}</span>
              <button
                onClick={() => setFlashSuccess("")}
                className="shrink-0 hover:text-green-200"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              error={error?.usernameOrEmail?.message}
              icon="user"
              type="text"
              onChange={handleInputChange("usernameOrEmail")}
              id="usernameOrEmail"
              placeholder="Username or email"
              value={formInput.usernameOrEmail}
            />
            <div className="space-y-1.5">
              <Input
                error={error?.password?.message}
                icon="lock"
                type={isShowPassword ? "text" : "password"}
                onChange={handleInputChange("password")}
                id="password"
                placeholder="Password"
                value={formInput.password}
              />
              <button
                type="button"
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                <i
                  className={`fa-solid ${isShowPassword ? "fa-eye-slash" : "fa-eye"}`}
                />
                {isShowPassword ? "Hide" : "Show"} password
              </button>
            </div>

            <Button
              type="submit"
              loadingText="Signing in..."
              label="Sign In"
              isLoading={loading}
            />
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-400 bg-transparent">
                or continue with
              </span>
            </div>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                window.open(
                  process.env.NEXT_PUBLIC_API_GOOGLE_AUTH_URL,
                  "_self",
                )
              }
              className="flex items-center justify-center gap-2 py-2.5 text-sm text-white border border-white/20 rounded-lg hover:bg-white/10 active:scale-95 transition-all duration-200"
            >
              <GoogleSVG /> Google
            </button>
            <button
              onClick={() =>
                window.open(
                  process.env.NEXT_PUBLIC_API_GITHUB_AUTH_URL,
                  "_self",
                )
              }
              className="flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-gray-900/60 border border-white/20 rounded-lg hover:bg-gray-900/80 active:scale-95 transition-all duration-200"
            >
              <GithubSVG /> GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withOutAuth(Login);
