import Image from "./images/Image";

export default function MessageFileSending({ attachments }: any) {
  return (
    <div
      className={`grid ${
        attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"
      } float-end gap-2`}
    >
      {attachments?.map((item: any, index: number) => (
        <Image
          key={index}
          alt={item?.name}
          rounded="md"
          avatar={URL.createObjectURL(item)}
          width={32}
          height={32}
          isUpload={true}
        />
      ))}
    </div>
  );
}
