import Image from "./images/Image";

export default function MessageFilePreview({
  attachments,
  setAttachments,
}: any) {
  const handleRemoveItem = (index: number) => () => {
    setAttachments((prev: any) =>
      prev.filter((_: any, idx: number) => idx !== index)
    );
  };

  return (
    <div className="w-full overflow-x-auto mb-2">
      <div className="flex h-32 gap-2 p-2 flex-nowrap">
        {attachments?.map((attachment: any, index: number) => (
          <div key={index} className="w-24 h-full flex-shrink-0 relative group">
            <div className="w-full h-full flex items-center justify-center">
              {attachment?.type?.startsWith("image") ? (
                <Image
                  avatar={URL.createObjectURL(attachment)}
                  width={"24"}
                  rounded="md"
                  height={"full"}
                  isUpload={true}
                />
              ) : (
                <span className="flex flex-col items-center justify-center">
                  <i className="fas fa-file text-6xl text-gray-600"></i>
                  <span className="truncate text-xs w-24 text-center">
                    {attachment?.name}
                  </span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemoveItem(index)}
              className="invisible group-hover:visible absolute top-0 right-0 rounded-md transition-all duration-100 ease-in-out h-full w-full flex items-center justify-center bg-black/50"
            >
              <i className="far fa-x"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
