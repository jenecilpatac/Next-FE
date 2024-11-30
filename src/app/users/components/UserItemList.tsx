import { useAuth } from "@/app/context/AuthContext";

export default function UserItemList({ item, index, handleVerifyUser }: any) {
  const { hasHigherRole }: any = useAuth();
  return (
    <>
      <tr
        className={`${
          index % 2 === 0
            ? "bg-gray-300 dark:bg-gray-900"
            : "bg-gray-100 dark:bg-gray-800"
        } hover:bg-gray-200 dark:hover:bg-gray-700 text-sm`}
      >
        <td className="border-y dark:border-gray-700 border-gray-300 px-4 py-2">
          {item.id}
        </td>
        <td className="border-y dark:border-gray-700 border-gray-300 px-4 py-2">
          {item.name}
        </td>
        <td className="border-y dark:border-gray-700 border-gray-300 px-4 py-2">
          {item.email}
        </td>
        <td className="border-y min-w-32 dark:border-gray-700 border-gray-300 px-4 py-2 text-sm">
          <span
            className={`text-center text-xs rounded-lg px-2 ${
              item.emailVerifiedAt || item.provider !== null
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          >
            {item.emailVerifiedAt || item.provider !== null
              ? "Verified"
              : "Not Verified"}
          </span>
        </td>
        <td className="border-y dark:border-gray-700 border-gray-300 px-4 py-2">
          {item.roles.map((role: any, index: number) => (
            <span
              key={index}
              className={`text-xs rounded-lg px-2 py-1 text-white ${
                role.name === "superadmin"
                  ? "bg-blue-600"
                  : role.name === "admin"
                  ? "bg-blue-400"
                  : role.name === "moderator"
                  ? "bg-[#6A0DAD]"
                  : "bg-[#008080]"
              }`}
            >
              {role.name}
            </span>
          ))}
        </td>
        <td className="border-y dark:border-gray-700 border-gray-300 px-4 py-2">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <button className="text-sm bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600 hover:scale-105 transition-all duration-300 ease-in-out">
              <span className="flex items-center gap-1">
                <i className="far fa-edit"></i> Edit
              </span>
            </button>
            <button className="text-sm bg-red-500 px-2 py-1 rounded-md hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out">
              <span className="flex gap-1 items-center">
                <i className="far fa-trash"></i> Delete
              </span>
            </button>
            {item.emailVerifiedAt === null &&
              item.provider === null &&
              hasHigherRole && (
                <button
                  type="button"
                  onClick={() => handleVerifyUser(item.id)}
                  className="text-sm bg-violet-500 px-2 py-1 rounded-md hover:bg-violet-600 hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <span className="flex gap-1 items-center">
                    <i className="far fa-check"></i> Verify
                  </span>
                </button>
              )}
          </div>
        </td>
      </tr>
    </>
  );
}