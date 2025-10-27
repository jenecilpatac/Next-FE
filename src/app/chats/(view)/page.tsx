"use client";

import { memo, useEffect, useRef, useState } from "react";
import ChatContent from "../components/ChatContent";
const ChatContentM = memo(ChatContent);
import RecentChatContent from "../components/RecentChatContent";
import Button from "../components/buttons/Button";
import TextArea from "../components/inputs/TextArea";
import useFetch from "../hooks/useFetch";
import withAuth from "@/app/lib/withAuth";
import RecentChat from "../components/loaders/RecentChat";
import Emoji from "@/app/components/emoji-picker/Emoji";
import Link from "next/link";
import useSocket from "../hooks/useSocket";
import api from "@/app/lib/axiosCall";
import Content from "../components/loaders/Content";
import { useAuth } from "@/app/context/AuthContext";
import DoubleRecentChat from "../components/loaders/DoubleRecentChat";
import useToastr from "../hooks/Toastr";
import { formatChatTimestamp } from "../utils/formatChatTimestamp";
import Image from "../components/images/Image";
import formatMessages from "../utils/formatMessages";
import IsReplying from "../components/is-replying";
import MessageFileUpload from "../components/message-file-upload";
import MessageFilePreview from "../components/message-file-preview";
import MessageFileSending from "../components/message-file-sending";
import { getAllPublicAttachments } from "@/services/message-attachments-service";
import ViewImages from "../components/view-images";
import isImage from "../utils/is-image";
import isVideo from "../utils/is-video";
const MessageFilePreviewPage = memo(MessageFilePreview);
const MessageFileSendingPreview = memo(MessageFileSending);

const Chats = () => {
  const { user }: any = useAuth();
  const [error, setError] = useState<any>("");
  const [formInput, setFormInput] = useState<any>({
    content: "",
    attachment: false,
  });
  const textareaRef = useRef<any>("");
  const seenSentinelRef = useRef<HTMLDivElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const {
    sentPublicMessage,
    sendPublicMessage,
    userTyping,
    userTypingInfo,
    sendMessage,
  }: any = useSocket();
  const {
    data: publicMessagesData,
    loading: publicMessagesDataLoading,
    loadingOnTake,
    setAddTake,
    setIsRefreshed,
  }: any = useFetch(
    "chat-messages/public-messages",
    sentPublicMessage,
    true,
    false
  );
  const {
    data,
    loading,
    loadingOnTake: loadingOnTakeUsers,
    setAddTake: setAddTakeUsers,
    setSearchTerm,
    searchTerm,
    loadingOnSearch,
  }: any = useFetch("users/to/chat", sentPublicMessage, true, true);
  const chatContentRef = useRef<any>(null);
  const [isSending, setIsSending] = useState(false);
  const emojiPickerRef = useRef<any>(null);
  const loadingOnTakeRef = useRef(loadingOnTake);
  const loadingOnTakeUsersRef = useRef(loadingOnTakeUsers);
  const recentChatRef = useRef<HTMLSpanElement>(null);
  const totalMessages = publicMessagesData?.messages?.length;
  const totalData = publicMessagesData?.totalData;
  const totalUsers = data?.users?.length;
  const totalUsersData = data?.totalData || 0;
  const [backToBottom, setBackToBottom] = useState(false);
  const searchRef = useRef<any>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const { showError }: any = useToastr();
  const messageRef = useRef<any>(null);
  const [isOpenRecentChat, setIsOpenRecentChat] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const isTyping = Object.keys(userTypingInfo || {}).length > 0;
  const messageDraft = localStorage.getItem(user?.id);
  const seenbies = publicMessagesData?.messages[0]?.seenbies || null;
  const [attachments, setAttachments] = useState<any>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [publicAttachments, setPublicAttachments] = useState<any>([]);
  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const publicAttachments = async () => {
      try {
        const response = await getAllPublicAttachments();
        if (response?.status === 200) {
          setPublicAttachments(
            response?.data?.attachments?.filter(
              (pa: any) =>
                isImage(pa?.value?.split(".")?.pop()) ||
                isVideo(pa?.value?.split(".")?.pop())
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    publicAttachments();
  }, []);

  useEffect(() => {
    if (!userTyping || !formInput?.content || !user) return;

    const handleTyping = () => {
      userTyping({ chatReference: null, user });
    };

    document.addEventListener("keydown", handleTyping);

    return () => {
      document.removeEventListener("keydown", handleTyping);
    };
  }, [userTyping, formInput, user]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as any)
      ) {
        setIsEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    loadingOnTakeRef.current = loadingOnTake;
    loadingOnTakeUsersRef.current = loadingOnTakeUsers;
  }, [loadingOnTake, loadingOnTakeUsers]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingOnTake &&
          totalMessages < totalData
        ) {
          setAddTake((prev: any) => prev + 20);
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, loadingOnTake, totalMessages, totalData]);

  useEffect(() => {
    if (!recentChatRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingOnTakeUsers &&
          totalUsers < totalUsersData
        ) {
          setAddTakeUsers((prev: any) => prev + 5);
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(recentChatRef.current);

    return () => {
      observer.disconnect();
    };
  }, [recentChatRef.current, loadingOnTakeUsers, totalUsers, totalUsersData]);

  useEffect(() => {
    const handleBackToBottomOnScroll = () => {
      if (chatContentRef.current) {
        const { scrollTop } = chatContentRef.current;

        setBackToBottom(scrollTop < -200);
      }
    };

    chatContentRef?.current?.addEventListener(
      "scroll",
      handleBackToBottomOnScroll
    );
    return () => {
      chatContentRef?.current?.removeEventListener(
        "scroll",
        handleBackToBottomOnScroll
      );
    };
  }, [chatContentRef]);

  useEffect(() => {
    if (publicMessagesData) {
      setIsSending(false);
      messageRef.current = null;
      setAttachments([]);
    }
  }, [publicMessagesData]);

  useEffect(() => {
    if (messageDraft) {
      if (user?.id) {
        setFormInput((formInput: any) => ({
          ...formInput,
          content: messageDraft,
        }));
      }
    }
  }, [user?.id, messageDraft]);

  useEffect(() => {
    if (!seenSentinelRef?.current || !seenbies) return;

    const observer = new IntersectionObserver(async (entries) => {
      if (
        entries[0].isIntersecting &&
        !seenbies?.some((seenBy: any) => seenBy?.user?.id === user?.id)
      ) {
        setIsRefreshed(true);
        sendMessage({
          toRefresh: true,
          receiverId: "",
          isSeenForSentMessage: true,
        });
        try {
          await api.post(`chat-messages/seen-public-message`, {
            messageId: publicMessagesData?.messages[0]?.id,
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsRefreshed(false);
          sendMessage({
            toRefresh: false,
            receiverId: "",
            isSeenForSentMessage: false,
          });
        }
      }
    });

    observer.observe(seenSentinelRef?.current);

    return () => {
      observer.disconnect();
    };
  }, [seenSentinelRef, seenbies, user?.id]);

  const handleBackToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = 0;
    }
  };

  const handleInputChange = (title: any) => (e: any) => {
    setFormInput((formInput: any) => ({
      ...formInput,
      [title]: e.target.value,
    }));
    localStorage.setItem(user?.id, e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (window.innerWidth > 640) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (formInput.content || attachments?.length > 0) {
          handleSendMessage();
        }
      }
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    if (textareaRef.current.scrollHeight > 200) {
      textareaRef.current.style.overflowY = "auto";
    } else {
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef.current) {
      const currentValue = textareaRef.current.value;
      const newValue = currentValue + emoji;
      setFormInput({
        content: newValue,
      });
    }
  };

  const handleEmojiPickerOpen = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleSendMessage = async () => {
    setFormInput({
      content: "",
      attachment: false,
    });
    messageRef.current = formInput?.content;
    sendPublicMessage(true, user?.id);
    setIsSending(true);
    textareaRef.current.focus();
    textareaRef.current.style.height = "18px";
    if (isEmojiPickerOpen) {
      handleEmojiPickerOpen();
    }
    const formData = new FormData();

    formData.append("content", formInput?.content?.trim());
    formData.append("attachment", attachments?.length > 0 ? "true" : "false");
    if (attachments?.length > 0) {
      attachments.forEach((file: any) => {
        formData.append("attachments", file);
      });
    }
    if (selectedMessage?.id) {
      formData.append("parentId", selectedMessage?.id);
    }
    try {
      const response = await api.post(
        "chat-messages/send-public-message",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setError("");
        setTimeout(() => {
          chatContentRef.current.scrollTop =
            chatContentRef.current.scrollHeight;
        }, 500);
        localStorage.removeItem(user?.id);
        setSelectedMessage(null);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
      if (error.response.status === 413) {
        showError("Payload too large. Please try again", "Error");
      }
      setError(error.response.data);
    } finally {
      sendPublicMessage(false, user?.id);
    }
  };

  const handleSendLike = async () => {
    sendPublicMessage(true, user?.id);
    setIsSending(true);
    messageRef.current = "(y)";
    try {
      const response = await api.post("chat-messages/send-public-message", {
        content: "(y)",
        parentId: selectedMessage?.id,
      });

      if (response.status === 201) {
        setTimeout(() => {
          chatContentRef.current.scrollTop =
            chatContentRef.current.scrollHeight;
        }, 500);
        setSelectedMessage(null);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      sendPublicMessage(false, user?.id);
    }
  };
  const handleSearchTerm = (e: any) => {
    if (searchRef.current) clearTimeout(searchRef.current);

    searchRef.current = setTimeout(() => {
      setSearchTerm(e.target.value);
      setAddTakeUsers(totalUsersData);
    }, 500);
  };

  const handleOpenRecentChat = () => {
    setIsOpenRecentChat(!isOpenRecentChat);
  };

  const typingUsers =
    userTypingInfo &&
    Object.values(userTypingInfo)?.filter((userType: any) => {
      return userType?.id !== user?.id;
    });

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles) {
      const files = Array.from(droppedFiles);
      setAttachments((prev: any) => [...prev, ...files]);
    }
    setIsDragOver(false);
  };

  const onDragLeave = (e: any) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handlePaste = (e: any) => {
    const files = e.clipboardData.files;

    if (files) {
      const droppedFiles = Array.from(files);
      setAttachments((prev: any) => [...prev, ...droppedFiles]);
    }
  };

  const handleOpenViewImages = (id: number) => () => {
    setCurrentIndex(id);
    setIsOpenImage(true);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`bg-white dark:bg-gray-700 border border-r border-gray-200 dark:border-gray-600 flex flex-col md:w-80 ${
          isOpenRecentChat ? "" : "w-0"
        }`}
      >
        <div className="p-4 border border-b border-gray-200 dark:border-gray-600">
          <div>
            <Link href="/chats">
              <p className="text-2xl font-bold">Chats</p>
            </Link>
          </div>
          <div
            className={`w-20 md:w-full mt-2 rounded-3xl py-3 pl-10 pr-3 relative bg-gray-200 dark:bg-gray-500 ${
              isOpenRecentChat ? "" : "hidden md:block"
            }`}
          >
            <input
              type="search"
              className="focus:outline-none bg-transparent w-full"
              placeholder="Search Chats"
              onChange={handleSearchTerm}
            />
            <i className="far fa-magnifying-glass text-gray-300 absolute left-3 top-3.5 text-xl"></i>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {/* Recent Chats */}
          {loading || loadingOnSearch ? (
            <RecentChat />
          ) : data?.users?.length > 0 ? (
            data?.users?.map((user: any, index: number) => (
              <RecentChatContent
                key={index}
                user={user}
                lastMessage={
                  user?._count?.messages !== 0 &&
                  `Total messages: ${user._count.messages}`
                }
              />
            ))
          ) : (
            <p className="text-center font-bold text-lg mt-5 break-words px-10 w-20 md:w-full">
              {searchTerm ? `No "${searchTerm}" found` : "No conversations yet"}
            </p>
          )}

          {loadingOnTakeUsers && <DoubleRecentChat />}
          <span ref={recentChatRef} className="p-2"></span>
        </div>
      </div>
      {/* Chat Area */}
      <div
        className="flex-1 flex flex-col overflow-hidden relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={onDragLeave}
      >
        {/* Chat Header */}
        <div className="bg-sky-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="block md:hidden"
              onClick={handleOpenRecentChat}
            >
              <i
                className={`far ${
                  isOpenRecentChat ? "fa-arrow-left" : "fa-arrow-right"
                }`}
              ></i>
            </button>
            <div className="ml-3">
              <p className="text-lg font-semibold">Public Chats</p>
              <p className="text-sm text-gray-200">
                {data?.totalUsersChatted} people chatted
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <i className="fas fa-users" />
            </button>
            <button className="text-white">
              <i className="fas fa-info-circle" />
            </button>
            <button className="text-white">
              <i className="fas fa-cog" />
            </button>
          </div>
        </div>
        {/* Message Container */}
        {isDragOver && (
          <div className="absolute inset-0 bg-black/70 z-50 grid place-items-center">
            <div className="text-center">
              <p className="text-xl font-bold">Drop files here</p>
              <p className="text-sm">max of 100mb</p>
            </div>
          </div>
        )}
        <div
          ref={chatContentRef}
          className="flex-1 flex flex-col-reverse px-4 py-10 bg-white overflow-y-auto dark:bg-gray-600 gap-1 border-b border-gray-200 dark:border-gray-600"
        >
          <div ref={seenSentinelRef}></div>
          {isSending && (messageRef?.current || attachments?.length > 0) && (
            <div className="relative opacity-60">
              <p className="text-end text-xs absolute right-0 -bottom-4">
                Sending...
              </p>
              <div className="flex justify-end group">
                <div className="justify-center flex mr-1 items-center">
                  <div className="group-hover:block hidden">
                    <button className="px-3.5 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-full">
                      <i className="far fa-ellipsis-vertical"></i>
                    </button>
                  </div>
                </div>
                <div
                  className={`${
                    messageRef?.current === "(y)"
                      ? ""
                      : "dark:bg-blue-400/50 bg-blue-400/80"
                  } xl:max-w-3xl 2xl:max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-2xl max-w-[230px] text-white p-3 rounded-2xl shadow-md`}
                >
                  <p className="text-sm whitespace-break-spaces break-words">
                    {formatMessages(messageRef?.current?.trim(), 16, 16)}
                  </p>
                </div>
              </div>

              {attachments?.length > 0 && (
                <MessageFileSendingPreview attachments={attachments} />
              )}
            </div>
          )}
          {isTyping &&
            userTypingInfo &&
            Object.values(userTypingInfo)?.some(
              (item: any) => item?.id !== user?.id
            ) && (
              <div className="relative pt-4">
                <div className="text-start absolute left-0 -bottom-2 flex gap-1">
                  {Object.values(userTypingInfo)
                    .slice(0, 5)
                    .map(
                      (userType: any) =>
                        userType?.id !== user?.id && (
                          <div
                            key={userType?.id}
                            className="flex items-center -ml-2 w-4 h-4"
                          >
                            <Image
                              avatar={
                                userType?.profile_pictures?.filter(
                                  (item: any) => item?.isSet
                                )[0]?.avatar
                              }
                              alt={userType?.name}
                              width={4}
                              height={4}
                              title={userType?.name}
                            />
                          </div>
                        )
                    )}
                  <div className="text-xs flex gap-1 items-center">
                    {typingUsers?.length > 5 && (
                      <span className="p-0.5 bg-gray-300 dark:bg-gray-400 rounded-full">
                        {typingUsers?.length - 5}+{" "}
                      </span>
                    )}
                    <div className="flex gap-1 items-center py-2 px-2 rounded-xl bg-gray-600 dark:bg-gray-300 w-fit">
                      {Array.from(Array(3)).map((_, index) => (
                        <span
                          className="rounded-full p-0.5 dark:bg-gray-800 bg-gray-200 animate-bounce"
                          key={index}
                          style={{ animationDelay: 0.3 * index + "s" }}
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          {publicMessagesDataLoading ? (
            <Content />
          ) : publicMessagesData && publicMessagesData?.messages?.length > 0 ? (
            publicMessagesData?.messages?.map((message: any, index: number) => {
              const currentTime = new Date(message.createdAt);

              const prevMessage =
                index > 0 ? publicMessagesData.messages[index - 1] : null;

              const nextMessage =
                index < publicMessagesData.messages.length - 1
                  ? publicMessagesData.messages[index + 1]
                  : null;

              const getUserMinuteKey = (msg: any) => {
                const time = new Date(msg.createdAt);
                return `${
                  msg.userId
                }-${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}`;
              };

              const currentKey = getUserMinuteKey(message);

              const prevKey = prevMessage
                ? getUserMinuteKey(prevMessage)
                : null;

              const nextKey = nextMessage
                ? getUserMinuteKey(nextMessage)
                : null;

              const isFirstInGroup = currentKey !== nextKey;
              const isLastInGroup = currentKey !== prevKey;

              const sameMinuteUserMessages = publicMessagesData.messages.filter(
                (m: any) => getUserMinuteKey(m) === currentKey
              );

              const isOnlyInMinuteUser = sameMinuteUserMessages.length === 1;

              const bubbleClass = isOnlyInMinuteUser && "rounded-3xl";

              return (
                <div key={index}>
                  {isFirstInGroup && (
                    <div className="flex justify-center text-gray-500 dark:text-gray-300 text-xs my-2">
                      {formatChatTimestamp(currentTime)}
                    </div>
                  )}
                  <ChatContentM
                    messageId={message?.id}
                    content={message?.content}
                    sender={message?.userId === user?.id}
                    name={message?.sentBy?.name}
                    avatar={message?.sentBy?.profile_pictures[0]?.avatar}
                    timeSent={message?.createdAt}
                    link={message?.link}
                    isLast={isLastInGroup}
                    isFirst={isFirstInGroup}
                    bubbleClass={bubbleClass}
                    sendMessageRealtime={sendPublicMessage}
                    userId={user?.id}
                    isDeleted={message?.isDeleted}
                    reactions={message?.reactions}
                    setSelectedMessage={setSelectedMessage}
                    toSelectMessage={message}
                    parent={message?.parent}
                    index={index}
                    textareaRef={textareaRef}
                    seenbies={seenbies}
                    attachments={message?.message_attachments}
                    handleOpenViewImages={handleOpenViewImages}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-center mb-20 items-center">
              Be the first to start a conversation in{" "}
              <strong>Public Chats</strong>. Say <strong>HI</strong>{" "}
              <i className="fas fa-hand-wave text-xl"></i>{" "}
            </p>
          )}
          {loadingOnTake && (
            <div className="relative flex justify-center items-center">
              <i className="fa-duotone fa-solid fa-spinner-third text-center animate-spin"></i>
            </div>
          )}
          <span ref={sentinelRef}></span>
        </div>
        {/* Message Input Area */}
        <IsReplying
          selectedMessage={selectedMessage}
          setSelectedMessage={setSelectedMessage}
        />
        <div className="bg-white dark:bg-gray-700 px-4 py-2 gap-2 flex items-center relative">
          <div
            className={`absolute left-1/2 bottom-4 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
              backToBottom ? "opacity-100 -top-20" : "opacity-0 -top-10"
            }`}
          >
            <button
              onClick={handleBackToBottom}
              className="py-3 px-3.5 text-white hover:bg-gray-400/75 hover:dark:bg-gray-500/75 dark:border-gray-400 border-gray-300 flex place-items-center rounded-full border bg-gray-400 dark:bg-gray-500"
              type="button"
            >
              <i className="far fa-arrow-down"></i>
            </button>
          </div>
          <MessageFileUpload
            setAttachments={setAttachments}
            isLoading={publicMessagesDataLoading}
          />
          <div className="relative w-full max-w-[calc(100%-60px)] py-2 bg-gray-100 dark:bg-gray-500 pr-10 rounded-3xl mx-9">
            {attachments?.length > 0 && (
              <MessageFilePreviewPage
                attachments={attachments}
                setAttachments={setAttachments}
              />
            )}
            <TextArea
              textareaRef={textareaRef}
              value={formInput.content}
              onChange={handleInputChange("content")}
              error={error?.content?.message}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              maxLength={85000}
              disabled={loading}
              onPaste={handlePaste}
            />
            <div className="absolute right-2 bottom-1">
              <Emoji
                onEmojiSelect={handleEmojiSelect}
                isEmojiPickerOpen={isEmojiPickerOpen}
                emojiPickerRef={emojiPickerRef}
              >
                <button type="button" onClick={handleEmojiPickerOpen}>
                  <i
                    className={`fas fa-smile ${
                      isEmojiPickerOpen
                        ? "text-yellow-500"
                        : "dark:text-white text-gray-600 hover:dark:text-gray-400 hover:text-gray-500"
                    } text-xl`}
                  ></i>
                </button>
              </Emoji>
            </div>
          </div>
          <div className="bottom-4 absolute right-4">
            {formInput.content || attachments?.length > 0 ? (
              <Button
                disabled={publicMessagesDataLoading}
                onClick={handleSendMessage}
                type="button"
                icon="paper-plane-top"
                color="blue-500"
                hoverColor="blue-600"
              />
            ) : (
              <Button
                disabled={publicMessagesDataLoading}
                type="button"
                onClick={handleSendLike}
                icon="thumbs-up"
                color="blue-500"
                hoverColor="blue-600"
              />
            )}
          </div>
        </div>
      </div>
      {isOpenImage && (
        <ViewImages
          images={publicAttachments}
          currentItem={currentIndex}
          setIsOpenImage={setIsOpenImage}
        />
      )}
    </div>
  );
};

export default withAuth(Chats);
