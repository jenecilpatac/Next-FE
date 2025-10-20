import { usePathname } from "next/navigation";
import formatMessages from "../utils/formatMessages";
import MessageBody from "./MessageBody";
import MessageBody2 from "./MessageBody2";
import { use, useEffect, useRef, useState } from "react";
import { Modal, ModalButton } from "@/app/components/ui/modal";
import api from "@/app/lib/axiosCall";
import useToastr from "../hooks/Toastr";
import IsDeletedMessage from "./is-deleted-message";

export default function ChatContent({
  content,
  sender,
  avatar,
  name,
  timeSent,
  link,
  isLast,
  isFirst,
  bubbleClass,
  messageId,
  sendMessageRealtime,
  userId,
  isDeleted,
}: any) {
  const pathname = usePathname();
  const message = formatMessages(content.trim(), 16, 16);
  const isIcon = content === "(y)";
  const isPublic = pathname === "/chats";
  const [isOpen, setIsOpen] = useState<{ [index: number]: boolean }>({
    [0]: false,
  });
  const [isOpenModal, setIsOpenModal] = useState<{ [index: number]: boolean }>({
    [0]: false,
  });
  const [modalType, setModalType] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const { showSuccess } = useToastr();

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen({ [0]: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const handleOpen = (index: number) => () => {
    setIsOpen({ [index]: !isOpen[index] });
  };

  const handleOpenModal = (index: number, type: string) => () => {
    setIsOpenModal({ [index]: !isOpenModal[index] });
    setModalType(type);
    setMessageContent(content);
  };

  const handleSubmit = (messageId: number) => async () => {
    setIsLoading(true);
    if (isPublic) {
      sendMessageRealtime(true, userId);
    } else {
      sendMessageRealtime({
        toRefresh: true,
        receiverId: "",
        isSeenForSentMessage: true,
      });
    }
    try {
      const response =
        modalType === "edit"
          ? await api.patch(`/chat-messages/update/${messageId}/message`, {
              content: messageContent,
            })
          : await api.delete(`/chat-messages/delete/${messageId}/message`);

      if (response.status === 200) {
        showSuccess("Message updated successfully", "Success");
      } else if (response.status === 204) {
        showSuccess("Message deleted successfully", "Success");
      }
      setMessageContent("");
      setError("");
      setIsOpenModal({ [0]: false });
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 400) {
        setError(error.response.data.content.message);
      }
    } finally {
      setIsLoading(false);
      if (isPublic) {
        sendMessageRealtime(false, userId);
      } else {
        sendMessageRealtime({
          toRefresh: false,
          receiverId: "",
          isSeenForSentMessage: true,
        });
      }
    }
  };

  return (
    <div>
      {sender ? (
        <div>
          {/* Sent Message */}
          {isDeleted ? (
            <IsDeletedMessage
              bubbleClass={bubbleClass}
              isLast={isLast}
              isFirst={isFirst}
              isOwner={true}
            />
          ) : (
            <MessageBody
              isIcon={isIcon}
              timeSent={timeSent}
              message={message}
              link={link}
              isFirst={isFirst}
              isLast={isLast}
              bubbleClass={bubbleClass}
              handleOpen={handleOpen}
              isOpen={isOpen}
              messageId={messageId}
              buttonRef={buttonRef}
              dropdownRef={dropdownRef}
              handleOpenModal={handleOpenModal}
            />
          )}
        </div>
      ) : (
        <div>
          {/* Received Message */}
          {isDeleted ? (
            <IsDeletedMessage
              bubbleClass={bubbleClass}
              isLast={isLast}
              isFirst={isFirst}
              avatar={avatar}
              name={name}
              isOwner={false}
            />
          ) : (
            <MessageBody2
              avatar={avatar}
              name={name}
              isPublic={isPublic}
              isIcon={isIcon}
              timeSent={timeSent}
              message={message}
              link={link}
              isLast={isLast}
              isFirst={isFirst}
              bubbleClass={bubbleClass}
            />
          )}
        </div>
      )}
      {isOpenModal[messageId] && (
        <Modal title={`${modalType} Message`}>
          <div>
            {modalType === "edit" ? (
              <>
                <textarea
                  value={messageContent}
                  onChange={(e: any) => setMessageContent(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full resize-none focus:outline-none focus:border-blue-500 min-h-15"
                  placeholder="Type a message..."
                ></textarea>
                {error && (
                  <small className="text-red-500 font-bold">{error}</small>
                )}
              </>
            ) : (
              "Are you sure you want to delete this message?"
            )}
          </div>

          <ModalButton>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleOpenModal(messageId, "")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit(messageId)}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isLoading && modalType === "edit"
                ? "Updating..."
                : isLoading && modalType
                ? "Removing..."
                : modalType === "edit"
                ? "Update"
                : "Remove"}
            </button>
          </ModalButton>
        </Modal>
      )}
    </div>
  );
}
