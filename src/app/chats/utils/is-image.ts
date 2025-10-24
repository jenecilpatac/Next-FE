export default function isImage(item?: string) {
  if (!item) return false;
  const imageFormat = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
    "tiff",
    "heic",
    "avif",
  ];
  return imageFormat.includes(item?.toLowerCase());
}
