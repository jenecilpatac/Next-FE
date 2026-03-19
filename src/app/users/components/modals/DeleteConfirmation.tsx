export default function DeleteConfirmation({ handleDeleteUser, userName, id, isOpen, onClose, isLoading }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center shrink-0">
              <i className="fa-solid fa-triangle-exclamation text-red-600 dark:text-red-400"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-200">{userName}</span>? This action is irreversible.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button type="button" onClick={() => handleDeleteUser(id)} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
            {isLoading ? <><i className="fa-solid fa-spinner animate-spin text-xs"></i> Deleting...</> : <><i className="fa-solid fa-trash text-xs"></i> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}
