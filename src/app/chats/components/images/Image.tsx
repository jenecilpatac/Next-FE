import { Storage } from "@/app/utils/StorageUtils";

export default function Image({
  avatar,
  width,
  rounded = "full",
  height,
  isUpload = false,
  ...props
}: any) {
  return (
    <img
      src={
        avatar
          ? isUpload
            ? avatar
            : Storage(avatar)
          : "https://imgs.search.brave.com/awksT_Zoh8G9Qn5d-CbZP4gAPcl0EDxLP0J88fgAnB4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTg3/ODA1MTU2L3ZlY3Rv/ci9wcm9maWxlLXBp/Y3R1cmUtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9Z2t2TERDZ3NI/SC04SGVRZTdKc2po/bE9ZNnZSQkprX3NL/VzlseWFMZ21Mbz0"
      }
      className={`w-${width} h-${height} object-cover rounded-${rounded} md:mx-0 select-none`}
      {...props}
    />
  );
}
