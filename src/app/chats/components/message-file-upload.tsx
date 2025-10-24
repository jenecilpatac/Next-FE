import { useRef } from "react";

export default function MessageFileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="bottom-3 absolute">
      <button
        type="button"
        onClick={() => console.log(inputRef?.current?.click())}
        className="hover:scale-105"
      >
        <i className="far fa-image text-2xl"></i>
      </button>
      <input ref={inputRef} type="file" hidden multiple />
    </div>
  );
}
