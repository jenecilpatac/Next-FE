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

  if (!isOpen) {
    return null;
  }

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
      console.error("Error submitting categories", error);
      setError(error.response.data);
      if (error.response.status === 429) {
        showError(error.response.statusText, "Error");
      }
    } finally {
      setIsRefresh(false);
      setLoading(false);
    }
  };

  const handleInputChange = (title: any) => (e: any) => {
    setFormInputs({
      ...formInputs,
      [title]: e.target.value,
    });
  };

  const handleCloseModal = () => {
    setError("");
    onClose(false);
    setFormInputs({
      categoryName: "",
      description: "",
      slug: "",
    });
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white relative dark:bg-gray-900 rounded-lg w-full mx-3 md:w-1/3 p-6 shadow-md transition duration-300 ease-in-out"
      >
        <div className="flex justify-between">
          <div>
            <h2 className="text-lg font-bold">Add Category</h2>
          </div>
          <div>
            <button
              type="button"
              className="absolute right-4 top-3 bg-gray-400 bg-opacity-75 px-2 py-0.5 rounded-full hover:scale-95 transition-all duration-300 ease-in-out hover:bg-gray-500 hover:bg-opacity-75"
              onClick={handleCloseModal}
            >
              <i className="fa-solid fa-xmark text-white"></i>
            </button>
          </div>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="mt-4 max-h-[70vh] overflow-y-auto">
            <Input
              type="text"
              id="categoryName"
              value={formInputs.categoryName}
              onChange={handleInputChange("categoryName")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category name"
              error={error.categoryName?.message}
              label="title"
            />
            <TextArea
              id="description"
              label="description"
              value={formInputs.description}
              onChange={handleInputChange("description")}
              className="mt-1 block w-full px-3 py-2 border dark:bg-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category description"
              rows={4}
              error={error.description?.message}
            />

            <Input
              label="slug"
              type="text"
              id="slug"
              value={formInputs.slug}
              onChange={handleInputChange("slug")}
              className="mt-1 block w-full px-3 dark:bg-gray-900 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category slug"
              error={error.slug?.message}
            />
          </div>

          <div className="flex justify-end space-x-1 mt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-500 bg-opacity-75 hover:bg-gray-600 hover:scale-95 px-2 py-2 text-white rounded-lg text-sm"
            >
              <i className="fa-solid fa-xmark"></i> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-sm hover:scale-95 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Submiting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-save"></i> Submit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
