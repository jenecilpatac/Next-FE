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

  if (!isOpen) return null;

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
      formInput.image.forEach((img: any) => formData.append("image", img));
      const response = await api.post("/posts/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        handleCloseModal();
        showSuccess(response.data.message, "Post Added");
      }
    } catch (error: any) {
      setError(error.response.data);
      setImageError(error?.response.data.message);
    } finally {
      setIsRefresh(false);
      setLoading(false);
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files)
      setFormInput((p: any) => ({ ...p, image: Array.from(e.target.files) }));
  };

  const handleRemoveImage = (index: number) => {
    setFormInput((p: any) => ({
      ...p,
      image: p.image.filter((_: any, i: number) => i !== index),
    }));
  };

  const visibilityOptions = [
    { value: "public", icon: "fa-earth-americas", label: "Public" },
    { value: "friends", icon: "fa-user-group", label: "Friends" },
    { value: "private", icon: "fa-lock", label: "Only me" },
  ];

  const currentVis = visibilityOptions.find(
    (o) => o.value === formInput.publishedAs,
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div
        ref={postModalRef || modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Create Post
          </h2>
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-sm"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Author + Visibility */}
            <div className="flex items-center gap-3">
              <Image
                avatar={user?.profile_pictures[0]?.avatar}
                alt={user?.name}
                h={11}
                w={11}
              />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <div className="relative mt-0.5">
                  <select
                    onChange={(e) =>
                      setFormInput((p: any) => ({
                        ...p,
                        publishedAs: e.target.value,
                      }))
                    }
                    value={formInput.publishedAs}
                    className="appearance-none pl-6 pr-6 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {visibilityOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <i
                    className={`fa-solid ${currentVis?.icon} absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none`}
                  ></i>
                  <i className="fa-solid fa-chevron-down absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <textarea
                onChange={(e) =>
                  setFormInput((p: any) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className="w-full px-0 py-1 text-sm bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 resize-none placeholder-gray-400 dark:text-white transition-colors"
                rows={4}
                placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
                value={formInput.description}
              />
              {error?.description && (
                <small className="text-red-500 text-xs">
                  {error.description.message}
                </small>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Category
              </label>
              <select
                onChange={(e) =>
                  setFormInput((p: any) => ({
                    ...p,
                    categoryId: e.target.value,
                  }))
                }
                value={formInput.categoryId}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="" hidden>
                  Select a category
                </option>
                <option value="" disabled>
                  Select a category
                </option>
                {categoriesLoading ? (
                  <option>Loading...</option>
                ) : (
                  categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))
                )}
              </select>
              {error?.categoryId && (
                <small className="text-red-500 text-xs">
                  {error.categoryId.message}
                </small>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <div className="flex items-center justify-between p-3 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Add photos
                </span>
                <button
                  type="button"
                  onClick={() => document.getElementById("image")?.click()}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                >
                  <i className="fa-solid fa-image text-green-600 dark:text-green-400"></i>
                </button>
                <input
                  hidden
                  accept="image/*"
                  id="image"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              {(imageError?.includes("Invalid image") ||
                imageError?.includes("File too large")) && (
                <small className="text-red-500 text-xs mt-1 block">
                  {imageError}
                </small>
              )}
              {formInput.image.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {formInput.image.length} photo(s) selected
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormInput((p: any) => ({ ...p, image: [] }))
                      }
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove all
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {formInput.image.map((img: any, i: number) => (
                      <div
                        key={i}
                        className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                        <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 truncate">
                          {formatFileSize(img.size)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <button
              type="submit"
              disabled={loading || !formInput.description}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 ${!formInput.description ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-xs"></i>{" "}
                  Posting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-xs"></i> Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
