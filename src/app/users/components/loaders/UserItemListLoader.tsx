export default function UserItemListLoader() {
  return (
    <>
      {Array.from(Array(7)).map((_, index) => (
        <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
          <td className="px-4 py-3"><div className="h-4 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" /></td>
          <td className="px-4 py-3"><div className="flex gap-2 justify-center"><div className="h-7 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" /><div className="h-7 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" /></div></td>
        </tr>
      ))}
    </>
  );
}
