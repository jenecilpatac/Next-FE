import api from "@/app/lib/axiosCall";
import { Storage } from "@/app/utils/StorageUtils";
import { useState } from "react";
import useToastr from "../../hooks/Toastr";
import ImageProfileLoader from "../loaders/ImageProfileLoader";

export default function AddProfileModal({
  isOpen,
  onClose,
  addModalRef,
  isSetProfile,
  setIsRefresh,
}: any) {
  const { showSuccess }: any = useToastr();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | any>(null);
  const [imageError, setImageError] = useState<string | any>("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (!isOpen) return null;

  const handleFileChange = (e: any) => {
    if (e.target.files) setAvatar(e.target.files);
  };

  const handleCancelUpload = () => {
    setImageError("");
    setAvatar(null);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    setIsRefresh(true);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatar[0]);
      const response = await api.post("/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        onClose(false);
        setAvatar(null);
        showSuccess(response.data.message, "Avatar Added");
        setImageError("");
      }
    } catch (error: any) {
      console.error(error);
      setImageError(error?.response.data.message);
    } finally {
      setIsRefresh(false);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[55] p-4">
      <div
        ref={addModalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <i className="fa-solid fa-camera text-blue-600 dark:text-blue-400 text-sm" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Update Profile Picture
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col items-center gap-4">
          <div className="relative">
            {isImageLoading && <ImageProfileLoader />}
            <img
              onLoad={() => setIsImageLoading(false)}
              src={
                avatar
                  ? URL.createObjectURL(avatar[0])
                  : isSetProfile?.length === 0 || isSetProfile === undefined
                    ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    : Storage(isSetProfile[0]?.avatar)
              }
              alt="User Avatar"
              className={`w-28 h-28 rounded-full border-4 border-gray-200 dark:border-gray-700 object-cover ${isImageLoading ? "hidden" : ""}`}
            />
            {avatar && (
              <button
                onClick={handleCancelUpload}
                className="absolute top-0 right-0 w-6 h-6 rounded-full bg-gray-800/70 hover:bg-gray-800 text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            )}
          </div>

          {imageError && (
            <small className="text-red-500 text-center">{imageError}</small>
          )}

          <input
            onChange={handleFileChange}
            id="avatar"
            type="file"
            accept="image/*"
            hidden
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={
              avatar
                ? handleUpload
                : () => document.getElementById("avatar")?.click()
            }
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin" /> Uploading...
              </>
            ) : avatar ? (
              <>
                <i className="fa-solid fa-upload" /> Upload
              </>
            ) : (
              <>
                <i className="fa-solid fa-plus" /> Choose Photo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
