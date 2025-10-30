import { ReactNode } from "react";

function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/70">
      <div className="dark:bg-gray-700 bg-white rounded-lg shadow-lg w-full md:w-1/3 2xl:w-1/4 p-6">
        <h2 className="text-xl font-semibold mb-4 capitalize">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ModalButton({ children }: { children: ReactNode }) {
  return <div className="flex justify-end space-x-3">{children}</div>;
}

export { Modal, ModalButton };
