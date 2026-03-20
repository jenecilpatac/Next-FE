import { Storage } from "@/app/utils/StorageUtils";
import { useEffect, useRef, useState } from "react";
import ImageLoading from "./loaders/ImageLoader";

export default function AvatarList({ image }: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) setDropdownOpen(false);
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

  return (
    <div className="rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-800">
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
          className={`absolute z-20 mt-1 top-8 w-36 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden ${
            isOverflowing === "right" ? "right-0" : isOverflowing === "left" ? "left-0" : "right-0"
          }`}
        >
          <a
            href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${image.avatar.replace("storage/profile-picture-uploads/", "")}`}
            target="_blank"
            download
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fa-solid fa-download text-gray-400 w-4" />
            Download
          </a>
        </div>
      )}

      {isImageLoading && <ImageLoading />}
      <img
        onLoad={() => setIsImageLoading(false)}
        src={Storage(image.avatar)}
        alt=""
        className={`w-full h-28 sm:h-40 object-cover ${isImageLoading ? "hidden" : ""}`}
      />
    </div>
  );
}
