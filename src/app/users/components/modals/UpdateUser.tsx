import api from "@/app/lib/axiosCall";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/fetchData";
import useToastr from "../../hooks/Toastr";
import { FormInputsInterface } from "../../types/FormInputsInterface";
import UpdateLoader from "../loaders/updateLoader";

export default function UpdateUser({
  modalRef,
  onClose,
  isOpen,
  setIsRefresh,
  userName,
  id,
}: any) {
  const [error, setError] = useState<string | any>("");
  const { data, error: errorRoles, loading }: any = useFetch(isOpen && "/role", false, false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: userData,
    error: errorUser,
    loading: loadingUser,
  }: any = useFetch(isOpen && `/users/${id}`, isLoading, false);
  const { showSuccess }: any = useToastr();
  const [formInputs, setFormInputs] = useState<FormInputsInterface | any>({});

  useEffect(() => {
    if (isOpen) {
      let roleId: string = "";

      if (userData?.user?.roles.length > 0) {
        userData?.user?.roles?.map((item: any) => (roleId = item.id));
      }

      setFormInputs({
        name: userData?.user?.name || "",
        username: userData?.user?.username || "",
        email: userData?.user?.email || "",
        role: roleId.toString() || "",
        password: "",
        confirmPassword: "",
        oldPassword: "",
      });
    }
  }, [isOpen, loadingUser]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: any) => (e: any) => {
    setFormInputs({
      ...formInputs,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRefresh(true);
    try {
      const response = await api.patch(`/users/${id}`, {
        ...formInputs,
      });

      if (response.status === 200) {
        setFormInputs({
          name: "",
          username: "",
          email: "",
          role: "",
          password: "",
          confirmPassword: "",
          oldPassword: "",
        });
        setError("");
        showSuccess(response.data.message, "User Updated");
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
    }
  };

  const handleClose = () => {
    onClose();
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[50]">
      <div
        ref={modalRef}
        className="p-6 bg-white dark:bg-gray-700 shadow-md w-full rounded-lg m-3 md:w-2/5 relative"
      >
        <button
          type="button"
          onClick={handleClose}
          className="px-2 text-white py-0.5 rounded-full bg-gray-400 bg-opacity-75 hover:scale-95 transition-all duration-300 ease-in-out hover:bg-gray-500 hover:bg-opacity-75 absolute top-2 right-2"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h2 className="text-xl font-bold mb-4">Updating {userName}...</h2>
        <hr className="border-gray-500" />
        <form onSubmit={handleSubmit}>
          {loadingUser ? (
            <UpdateLoader />
          ) : (
            <>
              <div className="space-y-3 py-2 overflow-y-auto max-h-[75vh]">
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    value={formInputs.name}
                    className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                    placeholder="Enter name"
                    onChange={handleChange("name")}
                  />
                  {error.name && (
                    <small className="text-red-500">{error.name.message}</small>
                  )}
                </div>
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    value={formInputs.username}
                    className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                    placeholder="Enter username"
                    onChange={handleChange("username")}
                  />
                  {error.username && (
                    <small className="text-red-500">
                      {error.username.message}
                    </small>
                  )}
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={formInputs.email}
                    className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                    placeholder="Enter email"
                    onChange={handleChange("email")}
                  />
                  {error.email && (
                    <small className="text-red-500">
                      {error.email.message}
                    </small>
                  )}
                </div>
                <div>
                  <label htmlFor="role">Select Role</label>
                  <select
                    onChange={handleChange("role")}
                    value={formInputs.role}
                    className="border capitalize border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="" hidden>
                      Select Role
                    </option>
                    <option value="" disabled>
                      Select Role
                    </option>
                    {loading ? (
                      <option value="Loading...">Loading...</option>
                    ) : (
                      data.roles.map((role: any, index: number) => (
                        <option key={index} value={role.id}>
                          {role.name}
                        </option>
                      ))
                    )}
                  </select>
                  {error.role && (
                    <small className="text-red-500">{error.role.message}</small>
                  )}
                </div>
                <div>
                  <label htmlFor="oldPassword">Old Password</label>
                  <input
                    type="password"
                    value={formInputs?.oldPassword}
                    className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                    placeholder="Enter old password"
                    onChange={handleChange("oldPassword")}
                  />
                  {error.oldPassword && (
                    <small className="text-red-500">
                      {error.oldPassword.message}
                    </small>
                  )}
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    value={formInputs?.password}
                    className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                    placeholder="Enter password"
                    onChange={handleChange("password")}
                  />
                  {error.password && (
                    <small className="text-red-500">
                      {error.password.message}
                    </small>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    value={formInputs?.confirmPassword}
                    className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                    placeholder="Enter confirm password"
                    onChange={handleChange("confirmPassword")}
                  />
                  {error.confirmPassword && (
                    <small className="text-red-500">
                      {error.confirmPassword.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-end border-t pt-3">
                <button
                  onClick={handleClose}
                  type="button"
                  className="px-2 py-1.5 rounded-md bg-gray-400 hover:scale-105 transition-all duration-300 ease-in-out hover:bg-gray-500"
                >
                  <i className="fa-solid fa-xmark"></i> Close
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-2 py-1.5 rounded-md bg-blue-400 hover:scale-105 transition-all duration-300 ease-in-out hover:bg-blue-500"
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>{" "}
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-save"></i> Update
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
