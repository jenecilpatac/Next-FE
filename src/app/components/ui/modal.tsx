import { ReactNode } from "react";

function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white capitalize">{title}</h2>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

function ModalButton({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-4">
      {children}
    </div>
  );
}

export { Modal, ModalButton };
