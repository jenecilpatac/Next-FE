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
  const [formInput, setFormInput] = useState<any>({
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

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        ...formInput,
      });

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
          title: "Success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#1E90FF",
          html: "You have successfully registered. You will be redirected to the login page. <br> Thank you!",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
      } else {
        setFlashError(response.data.message);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
      if (error.message === "Network Error") {
        setFlashError(`${error.message} or server error.`);
      }
      if (error.response.status === 429) {
        setFlashError(`${error.response.statusText}. Please try again later.`);
      }
      if (error.response.status === 400) {
        setFlashError("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (title: any) => async (e: any) => {
    const value = e.target.value;

    setFormInput((formInput: any) => ({
      ...formInput,
      [title]: value,
    }));
  };

  const handleCloseFlashError = () => {
    setFlashError("");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          'url("https://t4.ftcdn.net/jpg/08/94/02/21/360_F_894022146_cOoOtPF24XRZixcpnlojDhjZftU3p8dH.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="my-3 p-10 max-w-[26rem] bg-opacity-50 bg-black rounded-lg shadow-md">
        {flashError && (
          <div
            className="flex items-center px-4 py-5 mb-4 text-red-700 bg-red-100 border border-red-400 rounded"
            role="alert"
            aria-live="assertive"
          >
            <i className="w-6 h-6 mr-4 fa-solid fa-triangle-exclamation mt-2 text-red-500"></i>
            <span className="block ml-2 sm:inline">{flashError}</span>
            <button
              onClick={handleCloseFlashError}
              className="ml-auto text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Close alert"
            >
              &times;
            </button>
          </div>
        )}

        <h3 className="text-3xl font-bold text-white mb-6">
          Register to Your Account
        </h3>

        <form className="space-y-6" onSubmit={handleRegister}>
          <Input
            icon="envelope"
            error={error?.email?.message}
            type="email"
            onChange={handleChange("email")}
            value={formInput.email}
            id="email"
            placeholder="Enter your email"
          />
          <Input
            icon="user"
            error={error?.name?.message}
            type="text"
            onChange={handleChange("name")}
            value={formInput.name}
            id="name"
            placeholder="Enter your name"
          />
          <Input
            icon="user"
            error={error?.username?.message}
            type="text"
            onChange={handleChange("username")}
            id="username"
            placeholder="Enter your username"
            value={formInput.username}
          />
          <Input
            icon="location-dot"
            error={error?.address?.message}
            type="text"
            onChange={handleChange("address")}
            id="address"
            placeholder="Enter your address"
            value={formInput.address}
          />
          <Input
            icon="phone"
            error={error?.phoneNumber?.message}
            type="text"
            onChange={handleChange("phoneNumber")}
            id="phoneNumber"
            placeholder="Enter your phone number"
            value={formInput.phoneNumber}
          />
          <Input
            icon="calendar"
            error={error?.dateOfBirth?.message}
            type="date"
            onChange={handleChange("dateOfBirth")}
            id="dateOfBirth"
            placeholder="Enter your date of birth"
            value={formInput.dateOfBirth}
          />
          <Input
            icon="lock"
            error={error?.password?.message}
            type="password"
            onChange={handleChange("password")}
            id="password"
            placeholder="Enter your password"
            value={formInput.password}
          />
          <Input
            icon="lock"
            error={error?.confirmPassword?.message}
            type="password"
            onChange={handleChange("confirmPassword")}
            id="confirmPassword"
            placeholder="Enter your confirm password"
            value={formInput.confirmPassword}
          />

          <Button
            type="submit"
            bgColor="blue-600"
            hoverBgColor="blue-700"
            loadingText="Registering..."
            label="Register"
            isLoading={loading}
          />
        </form>

        <p className="mt-4 text-white text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default withOutAuth(Register);
