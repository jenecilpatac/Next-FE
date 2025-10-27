import { ChangeEvent, useRef } from "react";

export default function MessageFileUpload({ setAttachments, isLoading }: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments((prev: any) => [...prev, ...files]);
    }
    e.target.value = "";
  };
  return (
    <div className="bottom-3 absolute">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => inputRef?.current?.click()}
        className="hover:scale-105"
      >
        <i className="far fa-image text-2xl"></i>
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
}
