import { usePathname } from "next/navigation";
import formatMessages from "../utils/formatMessages";
import MessageBody from "./MessageBody";
import MessageBody2 from "./MessageBody2";
import { useEffect, useRef, useState } from "react";
import { Modal, ModalButton } from "@/app/components/ui/modal";
import api from "@/app/lib/axiosCall";
import useToastr from "../hooks/Toastr";
import IsDeletedMessage from "./is-deleted-message";
import reactionsData from "@/data/reactions.json";
import { Storage } from "@/app/utils/StorageUtils";
import Image from "./images/Image";
import isImage from "../utils/is-image";
import isVideo from "../utils/is-video";
import isAudio from "../utils/is-audio";

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
  reactions,
  setSelectedMessage,
  toSelectMessage,
  parent,
  index,
  textareaRef,
  seenbies,
  attachments,
  handleOpenViewImages,
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
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [isOpenReactions, setIsOpenReactions] = useState<{
    [key: number]: boolean;
  }>({
    [0]: false,
  });
  const [isOpenUserReactions, setIsOpenUserReactions] = useState<{
    [key: number]: boolean;
  }>({
    [0]: false,
  });
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
    setIsOpen({ [index]: false });
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
      setIsOpenModal({ [messageId]: false });
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

  const handleOpenReactions = (messageId: number) => () => {
    setIsOpenReactions({ [messageId]: !isOpenReactions[messageId] });
  };

  const handleReactToAMessage =
    ({
      messageId,
      value,
      label,
    }: {
      messageId: number;
      value: string;
      label: string;
    }) =>
    async () => {
      setIsReacting(true);
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
        const response = await api.post(`/chat-messages/react`, {
          messageId,
          value,
          label,
        });
        if (response.status === 201) {
          showSuccess(response.data.message, "Success");
          setIsOpenReactions({ [messageId]: false });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsReacting(false);
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

  const groupedReactions = Object.entries(
    reactions?.reduce((acc: any, reaction: any) => {
      const { value, user } = reaction;

      if (!acc[value]) {
        acc[value] = [];
      }
      acc[value].push(user);
      return acc;
    }, {})
  ).map(([label, users]) => ({
    label,
    users,
  }));

  const isReacted = (label: any) => {
    return reactions?.some(
      (reaction: any) =>
        reaction.userId === userId &&
        reaction.messageId === messageId &&
        reaction.label === label
    );
  };

  const handleOpenUsersReactions = (messageId: number) => () => {
    setIsOpenUserReactions({ [messageId]: !isOpenUserReactions[messageId] });
  };

  const handleIsReplying = () => {
    setSelectedMessage(toSelectMessage);
    textareaRef.current.focus();
    setIsOpen({ [0]: false });
  };

  const handleScrollToChat = () => {
    const el = document.getElementById(parent?.id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "end" });
      el.classList.add("animate-pulse");
      el.classList.add("scale-90");
      setTimeout(() => {
        el.classList.remove("animate-pulse");
        el.classList.remove("scale-90");
      }, 1500);
    }
  };

  const isAttached =
    !message[0]?.props?.children &&
    toSelectMessage?.attachment &&
    attachments?.length > 0;

  const images = attachments?.filter((file: any) =>
    isImage(file?.value?.split(".")?.pop())
  );

  const files = attachments?.filter(
    (file: any) =>
      !isVideo(file?.value?.split(".")?.pop()) &&
      !isImage(file?.value?.split(".")?.pop()) &&
      !isAudio(file?.value?.split(".")?.pop())
  );

  const videos = attachments?.filter((file: any) =>
    isVideo(file?.value?.split(".")?.pop())
  );

  const audios = attachments?.filter((file: any) =>
    isAudio(file?.value?.split(".")?.pop())
  );

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
              handleScrollToChat={handleScrollToChat}
              parent={parent}
              senderId={toSelectMessage?.userId}
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
              handleOpenReactions={handleOpenReactions}
              groupedReactions={groupedReactions}
              handleOpenUsersReactions={handleOpenUsersReactions}
              handleIsReplying={handleIsReplying}
              parent={parent}
              handleScrollToChat={handleScrollToChat}
              images={images}
              isDisplayedIfNotAttachment={isAttached}
              files={files}
              videos={videos}
              audios={audios}
              handleOpenViewImages={handleOpenViewImages}
            />
          )}
          {index === 0 && !isPublic && (
            <>
              <span className="float-end flex items-center gap-1">
                {toSelectMessage?.isSeen ? (
                  <>
                    <i className="far fa-eye text-[10px]"></i>
                    <span className="text-[10px]">Seen</span>
                  </>
                ) : (
                  <>
                    <i className="far fa-check text-[10px]"></i>
                    <span className="text-[10px]">Delivered</span>
                  </>
                )}
              </span>
            </>
          )}
          {index === 0 && isPublic && seenbies?.length > 0 && (
            <div className="flex gap-1 float-end">
              {seenbies?.map((seener: any, index: number) => (
                <Image
                  key={index}
                  avatar={seener?.user?.profile_pictures[0]?.avatar}
                  width={4}
                  height={4}
                  alt={seener?.user?.name}
                  title={seener?.user?.name ?? "Anonymous"}
                />
              ))}
            </div>
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
              handleScrollToChat={handleScrollToChat}
              parent={parent}
              senderId={toSelectMessage?.userId}
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
              messageId={messageId}
              handleOpenReactions={handleOpenReactions}
              groupedReactions={groupedReactions}
              handleOpenUsersReactions={handleOpenUsersReactions}
              isOpen={isOpen}
              handleOpen={handleOpen}
              dropdownRef={dropdownRef}
              buttonRef={buttonRef}
              handleIsReplying={handleIsReplying}
              parent={parent}
              senderId={toSelectMessage?.userId}
              handleScrollToChat={handleScrollToChat}
              images={images}
              isDisplayedIfNotAttachment={isAttached}
              files={files}
              videos={videos}
              audios={audios}
              handleOpenViewImages={handleOpenViewImages}
            />
          )}
          {index === 0 && isPublic && seenbies?.length > 0 && (
            <div className="flex gap-1 ml-12">
              {seenbies?.map((seener: any, index: number) => (
                <Image
                  key={index}
                  avatar={seener?.user?.profile_pictures[0]?.avatar}
                  width={4}
                  height={4}
                  alt={seener?.user?.name}
                  title={seener?.user?.name ?? "Anonymous"}
                />
              ))}
            </div>
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
              className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
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

      {isOpenReactions[messageId] && (
        <Modal title={`Add reactions`}>
          <div className="grid grid-cols-5 gap-1 mb-6">
            {reactionsData?.map((reaction: any, index: number) => (
              <button
                key={index}
                type="button"
                className={`flex flex-col items-center space-y-1 rounded-md p-2 hover:scale-110 transition-all duration-300 ease-in-out ${
                  isReacted(reaction.label)
                    ? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={handleReactToAMessage({
                  messageId,
                  value: reaction.value,
                  label: reaction.label,
                })}
                disabled={isReacting}
              >
                <span className="text-3xl">{reaction.value}</span>
                <span className="text-[10px] dark:text-gray-200 text-gray-600">
                  {reaction.label}
                </span>
              </button>
            ))}
          </div>

          <ModalButton>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleOpenReactions(messageId)}
              className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 w-full"
            >
              Close
            </button>
          </ModalButton>
        </Modal>
      )}

      {isOpenUserReactions[messageId] && reactions?.length > 0 && (
        <Modal title={`All reactions`}>
          <div className="flex flex-col gap-2 mb-6 max-h-96 overflow-y-auto">
            {reactions?.map((reaction: any, index: number) => (
              <button
                onClick={
                  reaction?.user?.id === userId
                    ? handleReactToAMessage({
                        messageId,
                        value: reaction.value,
                        label: reaction.label,
                      })
                    : undefined
                }
                type="button"
                className="flex gap-5 w-full items-center p-2 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-3xl"
                key={index}
              >
                <span className="text-3xl">{reaction.value}</span>
                <div className="w-12 h-12">
                  <Image
                    avatar={reaction?.user?.profile_pictures[0]?.avatar}
                    alt={reaction?.user?.name ?? "Anonymous"}
                    width={"auto"}
                    height={"auto"}
                  />
                </div>
                <span className="text-lg font-bold text-gray-700 dark:text-gray-300 break-words w-80 text-start">
                  {reaction?.user?.name ?? "Anonymous"}
                </span>
              </button>
            ))}
          </div>

          <ModalButton>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleOpenUsersReactions(messageId)}
              className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 w-full"
            >
              Close
            </button>
          </ModalButton>
        </Modal>
      )}
    </div>
  );
}
