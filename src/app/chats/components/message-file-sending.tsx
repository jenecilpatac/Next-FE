import isAudio from "../utils/is-audio";
import isImage from "../utils/is-image";
import isVideo from "../utils/is-video";
import Image from "./images/Image";

export default function MessageFileSending({ attachments }: any) {
  return (
    <div
      className={`grid ${
        attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"
      } float-end gap-2`}
    >
      {attachments?.map((item: any, index: number) =>
        isImage(item?.name?.split(".")?.pop()) ? (
          <Image
            key={index}
            alt={item?.name}
            rounded="md"
            avatar={URL.createObjectURL(item)}
            width={32}
            height={32}
            isUpload={true}
          />
        ) : isVideo(item?.name?.split(".")?.pop()) ? (
          <video
            key={index}
            src={URL.createObjectURL(item)}
            controls
            className="w-32 h-32"
          ></video>
        ) : isAudio(item?.name?.split(".")?.pop()) ? (
          <audio controls key={index}>
            <source
              src={URL.createObjectURL(item)}
              type={`audio/${item?.name?.split(".")?.pop()}`}
            />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <span
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <i className="fas fa-file text-6xl text-gray-600"></i>
            <span className="truncate text-xs w-24 text-center">
              {item?.name}
            </span>
          </span>
        )
      )}
    </div>
  );
}
