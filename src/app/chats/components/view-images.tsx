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
      <div className="flex flex-col h-full gap-6 w-full overflow-x-auto">
        {images?.length !== 0 && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
            <div className="relative w-10/12 md:w-1/2 h-auto overflow-hidden rounded-lg">
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
                        className="w-full h-full hover:scale-105 transition-all duration-300 ease-in-out"
                        src={Storage(image?.value)}
                        alt={`Image ${image.id}`}
                      />
                    )}
                    {isVideo(image?.value?.split(".")?.pop()) && (
                      <video
                        className="w-full h-full hover:scale-105 transition-all duration-300 ease-in-out"
                        src={Storage(image?.value)}
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {images?.length > 1 && (
          <div className="flex overflow-x-auto overflow-y-hidden gap-2 h-28 items-center justify-center">
            {images?.map((image: any) => (
              <div
                key={image.id}
                className="flex-shrink-0 h-28 w-20 relative cursor-pointer"
                onClick={() => selectImage(image.id)}
              >
                <div
                  className={`absolute h-full w-full ${
                    image.id === currentId ? "hover:bg-black/10" : "bg-black/80 hover:bg-black/10"
                  }`}
                ></div>
                {isImage(image?.value?.split(".")?.pop()) && (
                  <img
                    className="w-full h-full hover:scale-105 transition-all duration-300 ease-in-out"
                    src={Storage(image?.value)}
                    alt={`Image ${image.id}`}
                  />
                )}
                {isVideo(image?.value?.split(".")?.pop()) && (
                  <video
                    className="w-full h-full hover:scale-105 transition-all duration-300 ease-in-out"
                    src={Storage(image?.value)}
                    controls={false}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
