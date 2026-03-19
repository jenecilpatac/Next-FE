import api from "@/app/lib/axiosCall";
import React, { Dispatch, SetStateAction, useState } from "react";
import { CategoryType } from "../../types/CategoryTypes";
import useToastr from "../../hooks/Toastr";
import Input from "../inputs/Input";
import TextArea from "../inputs/TextArea";

export default function AddCategory({
  isOpen,
  onClose,
  setIsRefresh,
  modalRef,
}: {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  setIsRefresh: Dispatch<SetStateAction<boolean>>;
  modalRef: any;
}) {
  const [formInputs, setFormInputs] = useState({
    categoryName: "",
    description: "",
    slug: "",
  });
  const [error, setError] = useState<CategoryType | any>("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToastr();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRefresh(true);
    setLoading(true);
    try {
      const response = await api.post("/categories/create-category", {
        ...formInputs,
      });
      if (response.status === 201) {
        handleCloseModal();
        showSuccess(response.data.categoryName, response.statusText);
      }
    } catch (error: any) {
      setError(error.response.data);
      if (error.response.status === 429)
        showError(error.response.statusText, "Error");
    } finally {
      setIsRefresh(false);
      setLoading(false);
    }
  };

  const handleInputChange = (title: any) => (e: any) => {
    if (title === "categoryName") {
      setFormInputs((p) => ({
        ...p,
        slug: e.target.value.toLowerCase().trim().replace(/\s+/g, "-"),
      }));
    }
    setFormInputs((p) => ({ ...p, [title]: e.target.value }));
  };

  const handleCloseModal = () => {
    setError("");
    onClose(false);
    setFormInputs({ categoryName: "", description: "", slug: "" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-folder-plus text-blue-600 dark:text-blue-400 text-sm"></i>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Add Category
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-sm"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            <Input
              type="text"
              id="categoryName"
              value={formInputs.categoryName}
              onChange={handleInputChange("categoryName")}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter category name"
              error={error.categoryName?.message}
              label="Category Name"
            />
            <TextArea
              id="description"
              label="Description"
              value={formInputs.description}
              onChange={handleInputChange("description")}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Enter category description"
              rows={4}
              error={error.description?.message}
            />
            <Input
              label="Slug"
              type="text"
              id="slug"
              value={formInputs.slug}
              onChange={handleInputChange("slug")}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="auto-generated-slug"
              error={error.slug?.message}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-xs"></i>{" "}
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check text-xs"></i> Save Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
