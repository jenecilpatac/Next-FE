import api from "@/app/lib/axiosCall";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/fetchData";
import useToastr from "../../hooks/Toastr";
import { FormInputsInterface } from "../../types/FormInputsInterface";
import UpdateLoader from "../loaders/updateLoader";

const fieldClass = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1";

export default function UpdateUser({ modalRef, onClose, isOpen, setIsRefresh, userName, id }: any) {
  const [error, setError] = useState<string | any>("");
  const { data, loading }: any = useFetch(isOpen && "/role", false, false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: userData, loading: loadingUser }: any = useFetch(isOpen && `/users/${id}`, isLoading, false);
  const { showSuccess }: any = useToastr();
  const [formInputs, setFormInputs] = useState<FormInputsInterface | any>({});

  useEffect(() => {
    if (isOpen) {
      let roleId = "";
      if (userData?.user?.roles.length > 0) userData.user.roles.map((item: any) => (roleId = item.id));
      setFormInputs({
        name: userData?.user?.name || "", username: userData?.user?.username || "",
        email: userData?.user?.email || "", role: roleId.toString() || "",
        password: "", confirmPassword: "", oldPassword: "",
      });
    }
  }, [isOpen, loadingUser]);

  if (!isOpen) return null;

  const handleChange = (field: any) => (e: any) => setFormInputs({ ...formInputs, [field]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRefresh(true);
    try {
      const response = await api.patch(`/users/${id}`, { ...formInputs });
      if (response.status === 200) {
        setFormInputs({ name: "", username: "", email: "", role: "", password: "", confirmPassword: "", oldPassword: "" });
        setError("");
        showSuccess(response.data.message, "User Updated");
        onClose();
      }
    } catch (error: any) {
      setError(error.response.data);
    } finally { setIsLoading(false); setIsRefresh(false); }
  };

  const handleClose = () => { onClose(); setError(""); };

  const fields = [
    { label: "Name", key: "name", type: "text" },
    { label: "Username", key: "username", type: "text" },
    { label: "Email", key: "email", type: "email" },
    { label: "Old Password", key: "oldPassword", type: "password" },
    { label: "New Password", key: "password", type: "password" },
    { label: "Confirm Password", key: "confirmPassword", type: "password" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-user-pen text-blue-600 dark:text-blue-400 text-sm"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit User</h2>
              <p className="text-xs text-gray-400">{userName}</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-sm"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {loadingUser ? <div className="px-6 py-5"><UpdateLoader /></div> : (
            <>
              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className={labelClass}>{f.label}</label>
                    <input type={f.type} value={formInputs[f.key] ?? ""} onChange={handleChange(f.key)} placeholder={`Enter ${f.label.toLowerCase()}`} className={fieldClass} />
                    {error[f.key] && <small className="text-red-500 text-xs mt-0.5 block">{error[f.key].message}</small>}
                  </div>
                ))}
                <div>
                  <label className={labelClass}>Role</label>
                  <select value={formInputs.role ?? ""} onChange={handleChange("role")} className={fieldClass}>
                    <option value="" hidden>Select role</option>
                    <option value="" disabled>Select role</option>
                    {loading ? <option>Loading...</option> : data?.roles?.map((r: any, i: number) => <option key={i} value={r.id}>{r.name}</option>)}
                  </select>
                  {error.role && <small className="text-red-500 text-xs mt-0.5 block">{error.role.message}</small>}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
                  {isLoading ? <><i className="fa-solid fa-spinner animate-spin text-xs"></i> Saving...</> : <><i className="fa-solid fa-check text-xs"></i> Save Changes</>}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
