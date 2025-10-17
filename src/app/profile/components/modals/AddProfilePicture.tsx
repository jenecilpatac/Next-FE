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
  const [avatar, setAvater] = useState<File | any>(null);
  const [imageError, setImageError] = useState<string | any>("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (!isOpen) return null;

  const handleFileChange = (e: any) => {
    const files = e.target.files;

    if (files) {
      setAvater(files);
    }
  };

  const handleCancelUpload = () => {
    setImageError("");
    setAvater(null);
  };
  const handleUpload = async (e: any) => {
    e.preventDefault();
    setIsRefresh(true);
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("avatar", avatar[0]);

      const response = await api.post("/profile/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        onClose(false);
        setAvater(null);
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

  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[55]">
      <div
        ref={addModalRef}
        className="p-6 bg-white dark:bg-gray-700 shadow-md rounded-lg w-full md:w-1/3 m-3 relative"
      >
        <div>
          <h2 className="text-xl font-bold mb-2">Update profile picture</h2>
        </div>
        <hr />
        <button
          type="button"
          onClick={onClose}
          className="px-2 text-white py-0.5 rounded-full bg-gray-400 bg-opacity-75 hover:scale-95 transition-all duration-300 ease-in-out hover:bg-gray-500 hover:bg-opacity-75 absolute top-2 right-2"
        >
          <i className="far fa-xmark"></i>
        </button>
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="relative">
            <img
              onLoad={handleImageLoaded}
              src={
                avatar
                  ? URL.createObjectURL(avatar[0])
                  : isSetProfile?.length === 0 || isSetProfile === undefined
                  ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                  : Storage(isSetProfile[0]?.avatar)
              }
              alt="User Avatar"
              className={`w-32 mt-2 h-32 rounded-full border-2 border-gray-300 dark:border-gray-600 ${
                isImageLoading ? "hidden" : ""
              }`}
            />
            {isImageLoading && <ImageProfileLoader />}

            {avatar && (
              <>
                <button
                  onClick={handleCancelUpload}
                  className="bg-gray-400 text-white px-1.5 py-0.5 text-sm rounded-full mt-2 hover:-translate-y-1 transition-all duration-300 ease-in-out absolute top-0 right-2"
                >
                  <i className="far fa-xmark"></i>
                </button>
              </>
            )}
          </div>
          <div className="group flex flex-col items-center">
            <button
              type="button"
              onClick={
                avatar
                  ? handleUpload
                  : () => document.getElementById("avatar")?.click()
              }
              className="hover:bg-blue-700 text-white hover:bg-opacity-70 hover:scale-95 transition-all duration-300 ease-in-out rounded-md bg-blue-600 bg-opacity-70 px-2 py-1"
            >
              {avatar ? (
                <>
                  {loading ? (
                    <>
                      <i className="far fa-spinner animate-spin"></i> Uploading
                    </>
                  ) : (
                    <>
                      <i className="far fa-upload"></i> Upload
                    </>
                  )}
                </>
              ) : (
                <>
                  <i className="far fa-plus"></i> Upload photo
                </>
              )}
            </button>

            {(imageError?.includes(
              "Invalid image type, only jpeg, jpg, png, gif, ico, webp are allowed."
            ) ||
              imageError?.includes("File too large") ||
              imageError?.includes("Only image files are allowed!") ||
              imageError?.includes("File too large, only 5MB is allowed.")) && (
              <small className="text-red-500">{imageError}</small>
            )}
            <input
              onChange={handleFileChange}
              id="avatar"
              type="file"
              accept="image/*"
              hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
