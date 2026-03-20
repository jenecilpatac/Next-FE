import api from "@/app/lib/axiosCall";
import { useState } from "react";
import useFetch from "../../hooks/fetchData";
import useToastr from "../../hooks/Toastr";

const fieldClass = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1";

export default function AddUser({ modalRef, onClose, isOpen, setIsRefresh }: any) {
  const [error, setError] = useState<string | any>("");
  const { data, loading }: any = useFetch(isOpen && "/role", false, false);
  const { showSuccess }: any = useToastr();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<number | any>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRefresh(true);
    try {
      const response = await api.post("/users/create-user", { name, username, email, role, password, confirmPassword });
      if (response.status === 201) {
        setName(""); setUsername(""); setEmail(""); setRole(""); setPassword(""); setConfirmPassword(""); setError("");
        showSuccess(response.data.message, "User Added");
        onClose();
      }
    } catch (error: any) {
      setError(error.response.data);
    } finally { setIsLoading(false); setIsRefresh(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-user-plus text-blue-600 dark:text-blue-400 text-sm"></i>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Add User</h2>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-sm"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {[
              { label: "Name", value: name, setter: setName, type: "text", placeholder: "Enter full name", key: "name" },
              { label: "Username", value: username, setter: setUsername, type: "text", placeholder: "Enter username", key: "username" },
              { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "Enter email address", key: "email" },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelClass}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder} className={fieldClass} />
                {error[f.key] && <small className="text-red-500 text-xs mt-0.5 block">{error[f.key].message}</small>}
              </div>
            ))}
            <div>
              <label className={labelClass}>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
                <option value="" hidden>Select role</option>
                <option value="" disabled>Select role</option>
                {loading ? <option>Loading...</option> : data?.roles?.map((r: any, i: number) => <option key={i} value={r.id}>{r.name}</option>)}
              </select>
              {error.role && <small className="text-red-500 text-xs mt-0.5 block">{error.role.message}</small>}
            </div>
            {[
              { label: "Password", value: password, setter: setPassword, key: "password" },
              { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, key: "confirmPassword" },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelClass}>{f.label}</label>
                <input type="password" value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={`Enter ${f.label.toLowerCase()}`} className={fieldClass} />
                {error[f.key] && <small className="text-red-500 text-xs mt-0.5 block">{error[f.key].message}</small>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
              {isLoading ? <><i className="fa-solid fa-spinner animate-spin text-xs"></i> Adding...</> : <><i className="fa-solid fa-user-plus text-xs"></i> Add User</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
