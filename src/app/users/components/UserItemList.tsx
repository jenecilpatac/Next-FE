import { useAuth } from "@/app/context/AuthContext";
import UpdateUser from "./modals/UpdateUser";
import { useState } from "react";

export default function UserItemList({
  item,
  index,
  handleVerifyUser,
  handleConfirmDelete,
  setIsRefresh,
  isLoading,
  userId,
}: any) {
  const { hasHigherRole }: any = useAuth();
  const [isUpdateUserModal, setIsUpdateUserModal] = useState(false);
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");

  const handleUpdateUserModal = (id: string, name: string) => {
    setId(id);
    setUserName(name);
    setIsUpdateUserModal(!isUpdateUserModal);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-sm">
      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{item.id}</td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-gray-900 dark:text-white">{item.username}</span>
          {item.provider !== null && (
            <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-md w-fit capitalize">{item.provider}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.name}</td>
      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.email}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          item.emailVerifiedAt || item.provider !== null
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
        }`}>
          <i className={`fa-solid ${item.emailVerifiedAt || item.provider !== null ? "fa-circle-check" : "fa-circle-xmark"} text-[10px]`}></i>
          {item.emailVerifiedAt || item.provider !== null ? "Verified" : "Unverified"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {item.roles.map((role: any, index: number) => (
            <span key={index} className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white capitalize ${
              role.name === "superadmin" ? "bg-purple-600" : role.name === "admin" ? "bg-blue-600" : role.name === "moderator" ? "bg-indigo-500" : "bg-teal-600"
            }`}>{role.name}</span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5 items-center justify-center">
          <button type="button" onClick={() => handleUpdateUserModal(item.id, item.name)}
            className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2.5 py-1.5 rounded-lg transition-colors">
            <i className="fa-solid fa-pen text-[10px]"></i> Edit
          </button>
          <button type="button" onClick={() => handleConfirmDelete(item.id, item.name)}
            className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 px-2.5 py-1.5 rounded-lg transition-colors">
            <i className="fa-solid fa-trash text-[10px]"></i> Delete
          </button>
          {item.emailVerifiedAt === null && item.provider === null && hasHigherRole && (
            <button type="button" disabled={item.id === userId && isLoading} onClick={() => handleVerifyUser(item.id)}
              className="inline-flex items-center gap-1 text-xs font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60">
              {item.id === userId && isLoading
                ? <><i className="fa-solid fa-spinner animate-spin text-[10px]"></i> Verifying...</>
                : <><i className="fa-solid fa-check text-[10px]"></i> Verify</>}
            </button>
          )}
        </div>
      </td>
      <td>
        <UpdateUser isOpen={isUpdateUserModal} userName={userName} id={id} setIsRefresh={setIsRefresh} onClose={handleUpdateUserModal} />
      </td>
    </tr>
  );
}
