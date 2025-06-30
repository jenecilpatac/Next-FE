import api from "@/app/lib/axiosCall";
import { Dispatch, SetStateAction, useState } from "react";
import { PostValidationType } from "../../types/PostValidationType";
import useToastr from "../../hooks/Toastr";
import Image from "../images/Image";
import formatFileSize from "@/app/utils/formatFileSize";

export default function AddPost({
  isOpen,
  onClose,
  setIsRefresh,
  postModalRef,
  modalRef,
  categories,
  categoriesLoading,
  user,
}: any) {
  const [formInput, setFormInput] = useState<any>({
    categoryId: "",
    description: "",
    image: [],
    publishedAs: "public",
  });
  const [error, setError] = useState<PostValidationType | any>("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const { showSuccess } = useToastr();

  if (!isOpen) {
    return null;
  }

  const handleCloseModal = () => {
    onClose(false);
    setError("");
    setImageError("");
    setFormInput({
      categoryId: "",
      description: "",
      image: [],
      publishedAs: "public",
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsRefresh(true);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", formInput.description);
      formData.append("categoryId", String(formInput.categoryId));
      formData.append("publishedAs", String(formInput.publishedAs));
      formInput.image.forEach((img: any) => {
        formData.append("image", img);
      });

      const response = await api.post("/posts/create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        handleCloseModal();
        showSuccess(response.data.message, "Post Added");
      }
    } catch (error: any) {
      setError(error.response.data);
      setImageError(error?.response.data.message);
      console.error(error);
    } finally {
      setIsRefresh(false);
      setLoading(false);
    }
  };

  const handleFileChange = (e: any) => {
    const files = e.target.files;
    if (files) {
      setFormInput((formInput: any) => ({
        ...formInput,
        image: Array.from(files),
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormInput((formInput: any) => ({
      ...formInput,
      image: formInput.image.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleCancelUpload = () => {
    setFormInput((formInput: any) => ({
      ...formInput,
      image: [],
    }));
    setImageError("");
  };

  const handleInputChange = (title: any) => (e: any) => {
    setFormInput((formInput: any) => ({
      ...formInput,
      [title]: e.target.value,
    }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div
          ref={postModalRef || modalRef}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg w-full mx-3 md:w-1/3 relative"
        >
          <div className="flex justify-between">
            <div className="w-full mb-2">
              <h2 className="text-lg text-center font-bold">Create Post</h2>
            </div>
            <div>
              <button
                type="button"
                className="absolute right-4 top-3 bg-gray-400 bg-opacity-75 px-2 py-0.5 rounded-full hover:scale-95 transition-all duration-300 ease-in-out hover:bg-gray-500 hover:bg-opacity-75"
                onClick={handleCloseModal}
              >
                <i className="far fa-xmark text-black dark:text-white"></i>
              </button>
            </div>
          </div>
          <hr />
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-2">
                <Image
                  avatar={user?.profile_pictures[0]?.avatar}
                  alt={user?.name}
                  h={12}
                  w={12}
                />
                <div>
                  <p className="font-bold text-md">{user?.name}</p>
                  <div className="flex gap-1 bg-gray-300 dark:bg-gray-700 max-w-fit p-1 rounded-md items-center">
                    <i className="far fa-earth-americas"></i>
                    <select
                      onChange={handleInputChange("publishedAs")}
                      value={formInput.publishedAs}
                      className="bg-transparent focus:outline-none dark:bg-gray-700 bg-gray-300"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium" htmlFor="category">
                  Select Category
                </label>
                <select
                  onChange={handleInputChange("categoryId")}
                  name="category"
                  value={formInput.categoryId}
                  className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:shadow-outline focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" hidden>
                    Select Category
                  </option>
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categoriesLoading ? (
                    <option value="Loading...">Loading...</option>
                  ) : (
                    categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))
                  )}
                </select>
                {error?.categoryId && (
                  <small className="text-red-500">
                    {error?.categoryId.message}
                  </small>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  onChange={handleInputChange("description")}
                  className="appearance-none border border-gray-300 dark:border-gray-700 h-auto resize-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-500 focus:border-blue-500"
                  id="description"
                  rows={7}
                  placeholder={`What's on your mind, ${
                    user?.name?.split(" ")[0]
                  }?`}
                  value={formInput.description}
                />
                {error?.description && (
                  <small className="text-red-500">
                    {error?.description.message}
                  </small>
                )}
              </div>
              <div>
                <div className="border p-2 border-gray-300 dark:border-gray-700 flex justify-between rounded-md items-center">
                  <span>Add to your post</span>
                  <button
                    type="button"
                    className="items-center flex hover:bg-gray-200 hover:dark:bg-gray-700 p-2 rounded-full"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <i className="far fa-image text-2xl text-green-700 dark:text-green-600"></i>
                  </button>
                  <input
                    hidden
                    accept="image/*"
                    className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-500 focus:border-blue-500"
                    id="image"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    placeholder="Image"
                  />
                </div>
                <div>
                  {error?.image && (
                    <small className="text-red-500">
                      {error?.image.message}
                    </small>
                  )}
                  {(imageError?.includes(
                    "Invalid image type, only jpeg, jpg, png, gif, ico, webp are allowed."
                  ) ||
                    imageError?.includes("File too large") ||
                    imageError?.includes(
                      "File too large, only 1MB is allowed."
                    )) && <small className="text-red-500">{imageError}</small>}

                  {formInput.image.length > 0 && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleCancelUpload}
                        className="mb-2 text-blue-500 hover:underline"
                      >
                        Cancel upload
                      </button>
                      <div className="flex gap-2 w-full overflow-x-auto">
                        {formInput.image.map((image: any, index: number) => (
                          <div key={index}>
                            <div className="relative group w-20 h-20">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${image.name}`}
                                className="w-full h-full object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="text-sm absolute inset-0 m-auto text-white bg-black bg-opacity-50 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="w-20 truncate">
                              <small>{image.name}</small>
                            </p>
                            <p>
                              <small>{formatFileSize(image.size)}</small>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="w-full mt-5">
                <button
                  type="submit"
                  disabled={loading || !formInput.description}
                  className={`w-full text-white font-bold py-2 px-4 rounded text-sm ${
                    !formInput.description
                      ? "bg-gray-400/75 dark:bg-gray-700/75 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out"
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="far fa-spinner animate-spin"></i> Posting...
                    </>
                  ) : (
                    <>
                      <i className="far fa-paper-plane"></i> Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
