import { usePathname } from "next/navigation";
import formatMessages from "../utils/formatMessages";
import MessageBody from "./MessageBody";
// import useLinkPreview from "../hooks/useLinkPreview";
// import MessageLinkPreview from "./MessageLinkPreview";
import MessageBody2 from "./MessageBody2";
import { useEffect } from "react";
import Link from "next/link";

export default function ChatContent({
  content,
  sender,
  avatar,
  name,
  timeSent,
  link,
}: any) {
  const pathname = usePathname();
  const message = formatMessages(content.trim(), 16, 16);
  const isIcon = content === "(y)";
  const isPublic = pathname === "/chats";

  return (
    <div>
      {sender ? (
        <div>
          {/* Sent Message */}
          <MessageBody
            isIcon={isIcon}
            timeSent={timeSent}
            message={message}
            link={link}
          />
        </div>
      ) : (
        <div>
          {/* Received Message */}
          <MessageBody2
            avatar={avatar}
            name={name}
            isPublic={isPublic}
            isIcon={isIcon}
            timeSent={timeSent}
            message={message}
            link={link}
          />
        </div>
      )}
    </div>
  );
}
