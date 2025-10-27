import { Storage } from "@/app/utils/StorageUtils";
import { useState } from "react";
import isImage from "../utils/is-image";
import isVideo from "../utils/is-video";

export default function ViewImages({
  images,
  currentItem,
  setIsOpenImage,
}: any) {
  const [currentId, setCurrentId] = useState<any>(currentItem);

  const currentIndex =
    images?.findIndex((img: any) => img.id === currentId) ?? 0;

  const prevImage = () => {
    if (!images?.length) return;

    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentId(images[prevIndex].id);
  };

  const nextImage = () => {
    if (!images?.length) return;

    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentId(images[nextIndex].id);
  };

  const selectImage = (id: any) => {
    setCurrentId(id);
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
      <div className="absolute right-5 top-5">
        <button
          type="button"
          className="hover:bg-black/50 p-2 rounded-md"
          onClick={() => setIsOpenImage(false)}
        >
          <i className="far fa-x"></i>
        </button>
      </div>
      {images?.length !== 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-1/2 h-auto overflow-hidden rounded-lg">
            <div
              className="w-full h-full flex transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images?.map((image: any) => (
                <div
                  key={image.id}
                  className="flex-shrink-0 w-full h-full relative"
                >
                  {isImage(image?.value?.split(".")?.pop()) && (
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                      src={Storage(image?.value)}
                      alt={`Image ${image.id}`}
                    />
                  )}
                  {isVideo(image?.value?.split(".")?.pop()) && (
                    <video
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                      src={Storage(image?.value)}
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {images?.length > 1 && (
            <div className="flex justify-center mt-2">
              {images?.map((image: any) => (
                <div
                  onClick={() => selectImage(image.id)}
                  key={image.id}
                  className={`w-2.5 h-2.5 mx-1 rounded-full cursor-pointer hover:bg-blue-500 ${
                    currentId === image.id ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {images?.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 dark:bg-black dark:bg-opacity-50 p-2 bg-gray-200 rounded hover:bg-opacity-75"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 dark:bg-black dark:bg-opacity-50 p-2 bg-gray-200 rounded hover:bg-opacity-75"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
    </div>
  );
}
