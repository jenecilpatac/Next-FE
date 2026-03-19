import api from "@/app/lib/axiosCall";
import { Storage } from "@/app/utils/StorageUtils";
import { useEffect, useRef, useState } from "react";
import useToastr from "../hooks/Toastr";
import ImageLoading from "./loaders/ImageLoader";

export default function AvatarList({ image, setIsRefresh }: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { showSuccess, showError } = useToastr();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      )
        setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkOverFlow = () => {
      const dropdown = dropdownRef.current;
      if (dropdown) {
        const rect = dropdown.getBoundingClientRect();
        if (rect.right > window.innerWidth) setIsOverflowing("right");
        else if (rect.left < 0) setIsOverflowing("left");
      }
    };
    window.addEventListener("resize", checkOverFlow);
    checkOverFlow();
    return () => window.removeEventListener("resize", checkOverFlow);
  }, [dropdownOpen]);

  const handleUpdateProfile = async (id: number) => {
    setIsRefresh(true);
    try {
      const response = await api.patch(`/profile/update-profile-picture/${id}`);
      if (response.status === 200) {
        showSuccess(response.data.message, "Profile Picture Updated");
        setDropdownOpen(false);
      }
    } catch (error: any) {
      showError(error.response.data.message, "Something went wrong");
    } finally {
      setIsRefresh(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsRefresh(true);
    try {
      const response = await api.delete(`/profile/${id}`);
      if (response.status === 200) {
        showSuccess(response.data.message, "Profile Picture Deleted");
        setDropdownOpen(false);
      }
    } catch (error: any) {
      showError(error.response.data.message, "Something went wrong");
    } finally {
      setIsRefresh(false);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-800 flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
      >
        <i className="fa-solid fa-ellipsis text-xs" />
      </button>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-20 mt-1 top-8 w-44 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden ${
            isOverflowing === "right"
              ? "right-0"
              : isOverflowing === "left"
                ? "left-0"
                : "right-0"
          }`}
        >
          <button
            type="button"
            onClick={() => handleUpdateProfile(image.id)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fa-solid fa-user-check text-blue-500 w-4" />
            Set as profile
          </button>
          <a
            href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${image.avatar.replace("storage/profile-picture-uploads/", "")}`}
            target="_blank"
            download
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fa-solid fa-download text-gray-400 w-4" />
            Download
          </a>
          <button
            type="button"
            onClick={() => handleDelete(image.id)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <i className="fa-solid fa-trash w-4" />
            Remove
          </button>
        </div>
      )}

      {isImageLoading && <ImageLoading />}
      <img
        onLoad={() => setIsImageLoading(false)}
        src={Storage(image.avatar)}
        alt=""
        className={`w-full h-auto ${isImageLoading ? "hidden" : ""}`}
      />
    </div>
  );
}
