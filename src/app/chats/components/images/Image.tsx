import { Storage } from "@/app/utils/StorageUtils";

export default function Image({ avatar, width, height, ...props }: any) {
  return (
    <img
      src={
        avatar
          ? Storage(avatar)
          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      className={`w-${width} h-${height} object-cover rounded-full mx-auto md:mx-0`}
      {...props}
    />
  );
}
