import api from "@/app/lib/axiosCall";
import { useState } from "react";
import useFetch from "../../hooks/fetchData";
import useToastr from "../../hooks/Toastr";

export default function AddUser({
  modalRef,
  onClose,
  isOpen,
  setIsRefresh,
}: any) {
  const [error, setError] = useState<string | any>("");
  const { data, error: errorRoles, loading }: any = useFetch(isOpen && "/role", false, false);
  const { showSuccess }: any = useToastr();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<number | any>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRefresh(true);
    try {
      const response = await api.post("/users/create-user", {
        name,
        username,
        email,
        role,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        setName("");
        setUsername("");
        setEmail("");
        setRole("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        showSuccess(response.data.message, "User Added");
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[50]">
      <div
        ref={modalRef}
        className="p-6 bg-white dark:bg-gray-700 shadow-md w-full rounded-lg m-3 md:w-2/5 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="px-2 text-white py-0.5 rounded-full bg-gray-400 bg-opacity-75 hover:scale-95 transition-all duration-300 ease-in-out hover:bg-gray-500 hover:bg-opacity-75 absolute top-2 right-2"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h2 className="text-xl font-bold mb-4">Add User</h2>
        <hr className="border-gray-500" />
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 max-h-[75vh] overflow-y-auto py-2">
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                value={name}
                className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
              {error.name && (
                <small className="text-red-500">{error.name.message}</small>
              )}
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                value={username}
                className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
              {error.username && (
                <small className="text-red-500">{error.username.message}</small>
              )}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.email && (
                <small className="text-red-500">{error.email.message}</small>
              )}
            </div>
            <div>
              <label htmlFor="role">Select Role</label>
              <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error.password && (
                <small className="text-red-500">{error.password.message}</small>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                className="border border-gray-300 dark:border-gray-600 w-full rounded-md py-2 focus:ring-1 px-2 focus:outline-none focus:ring-blue-500"
                placeholder="Enter confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={onClose}
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
                  <i className="fa-solid fa-spinner animate-spin"></i> Adding...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i> Add user
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
