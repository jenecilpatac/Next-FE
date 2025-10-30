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
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleImageLoaded = () => {
    setIsImageLoading(false);
  };
  useEffect(() => {
    const checkOverFlow = () => {
      const dropdown = dropdownRef.current;

      if (dropdown) {
        const rect = dropdown.getBoundingClientRect();

        const overflowRight = rect.right > window.innerWidth;
        const overflowLeft = rect.left < 0;

        if (overflowRight) {
          setIsOverflowing("right");
        } else if (overflowLeft) {
          setIsOverflowing("left");
        }
      }
    };

    window.addEventListener("resize", checkOverFlow);

    checkOverFlow();

    return () => {
      window.removeEventListener("resize", checkOverFlow);
    };
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
      console.error(error);
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
      console.error(error);
      showError(error.response.data.message, "Something went wrong");
    } finally {
      setIsRefresh(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 shadow-md rounded-lg relative">
        <span className="absolute top-1 right-1 text-lg">
          <div className="relative inline-block text-left">
            <button
              ref={buttonRef}
              type="button"
              onClick={toggleDropdown}
              className="bg-gray-500 bg-opacity-80 rounded-full px-2.5 py-1 hover:-translate-x-1 transition-all duration-300 ease-in-out"
            >
              <i className="far fa-pen text-white"></i>
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className={`${
                  isOverflowing === "right"
                    ? "left-auto right-0"
                    : isOverflowing === "left"
                    ? "left-0 right-auto"
                    : "right-0"
                } absolute z-10 mt-2 w-52 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black/5 focus:outline-none`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <div className="py-1 w-full">
                  <button
                    type="button"
                    onClick={() => handleUpdateProfile(image.id)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-start"
                    role="menuitem"
                    id="menu-item-2"
                  >
                    Set as profile
                  </button>
                  <a
                    href={`${
                      process.env.NEXT_PUBLIC_STORAGE_URL
                    }/${image.avatar.replace(
                      "storage/profile-picture-uploads/",
                      ""
                    )}`}
                    target="_blank"
                    download
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-start"
                    role="menuitem"
                    id="menu-item-0"
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(image.id)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-start"
                    role="menuitem"
                    id="menu-item-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </span>
        {isImageLoading && <ImageLoading />}

        <img
          onLoad={handleImageLoaded}
          src={Storage(image.avatar)}
          alt=""
          className={`w-full h-auto rounded-lg ${
            isImageLoading ? "hidden" : ""
          }`}
        />
      </div>
    </>
  );
}
