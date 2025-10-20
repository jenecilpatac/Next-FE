"use client";

import { useEffect, useRef, useState } from "react";
import ChatContent from "../../components/ChatContent";
import RecentChatContent from "../../components/RecentChatContent";
import Button from "../../components/buttons/Button";
import TextArea from "../../components/inputs/TextArea";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/axiosCall";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "@/app/context/AuthContext";
import withAuth from "@/app/lib/withAuth";
import Image from "../../components/images/Image";
import ChatHeader from "../../components/loaders/ChatHeader";
import Content from "../../components/loaders/Content";
import useSocket from "../../hooks/useSocket";
import RecentChat from "../../components/loaders/RecentChat";
import Emoji from "@/app/components/emoji-picker/Emoji";
import Link from "next/link";
import { useConversation } from "../../context/conversationContext";
import useToastr from "../../hooks/Toastr";
import DoubleRecentChat from "../../components/loaders/DoubleRecentChat";
import { formatChatTimestamp } from "../../utils/formatChatTimestamp";
import formatMessages from "../../utils/formatMessages";

const Chats = () => {
  const { id }: any = useParams();
  const {
    sendMessage,
    isSeenSentMessage,
    userTypingPrivate,
    userTypingInfoPrivate,
    privateChatIds,
    sentMessage,
  }: any = useSocket();
  const { data, loading }: any = useFetch(
    id && `/users/for/seo/${id}`,
    false,
    false,
    false
  );
  const { user }: any = useAuth();
  const [error, setError] = useState<any>("");
  const [formInput, setFormInput] = useState({
    content: "",
    attachment: "",
  });
  const textareaRef = useRef<any>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const chatContentRef = useRef<any>(null);
  const navigate = useRouter();
  const [isSending, setIsSending] = useState(false);
  const emojiPickerRef = useRef<any>(null);
  const {
    data: convos,
    loading: loadingConvos,
    setIsRefresh,
    loadingOnTake,
    setAddTake,
    setHasParams,
    setSearchTerm,
    searchTerm,
    loadingOnSearch,
  }: any = useConversation();
  const {
    data: privateMessages,
    loading: privateMessagesLoading,
    setAddTakeMessages: setAddTakePrivateMessages,
    loadingOnTakeMessages: loadingOnTakePrivateMessages,
    loading: isLoadingPrivateMessages,
  }: any = useFetch(
    id && `/chat-messages/private/${id}/messages`,
    sentMessage,
    true,
    false
  );
  const loadingOnTakeRef = useRef(loadingOnTake);
  const [backToBottom, setBackToBottom] = useState(false);
  const { showError }: any = useToastr();
  const searchRef = useRef<any>(null);
  const recentChatRef = useRef<any>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const unreadMessageRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<any>(null);
  const [messageDetails, setMessageDetails] = useState({
    chatId: 0,
    receiverId: "",
  });
  const [isOpenRecentChat, setIsOpenRecentChat] = useState(false);
  let firstUnreadIndex: any = null;

  const totalMessages =
    (!isLoadingPrivateMessages &&
      privateMessages?.messages[0]?.messages?.length) ||
    0;
  const totalData =
    (!isLoadingPrivateMessages &&
      privateMessages?.messages[0]?._count?.messages) ||
    0;

  const totalUsersData = convos?.totalSearchedData || 0;
  const totalConvosData = privateMessages?.totalConvosData || 0;
  const totalConvos = convos?.conversations?.length || 0;

  useEffect(() => {
    if (!formInput.content || !user) return;
    const handleTyping = () => {
      userTypingPrivate({ receiverId: id, senderId: user?.id, user });
    };
    document.addEventListener("keydown", handleTyping);

    return () => {
      document.removeEventListener("keydown", handleTyping);
    };
  }, [userTypingPrivate, formInput, user, id]);

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
  }, [loadingOnTake]);

  const handleSeenMessage =
    (receiverId: string, chatId: number) => async () => {
      if (receiverId === id && isSeenSentMessage) {
        setIsRefresh(true);
      } else {
        setTimeout(() => {
          setIsRefresh(true);
        }, 10000);
      }
      try {
        const response = await api.patch(
          `chat-messages/seen-message/${receiverId}/${chatId}`
        );
        if (response.status === 200) {
          setMessageDetails({
            chatId: 0,
            receiverId: "",
          });
          firstUnreadIndex = null;
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (receiverId === id && isSeenSentMessage) {
          setIsRefresh(false);
        } else {
          setTimeout(() => {
            setIsRefresh(false);
          }, 10000);
        }
        sendMessage({
          toRefresh: false,
          isSeenForSentMessage: false,
        });
      }
    };

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingOnTakePrivateMessages &&
          totalMessages < totalData
        ) {
          setAddTakePrivateMessages((prev: any) => prev + 10);
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
  }, [loadingOnTakePrivateMessages, totalMessages, totalData, sentinelRef]);

  useEffect(() => {
    if (!unreadMessageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          firstUnreadIndex !== -1 &&
          messageDetails.receiverId &&
          messageDetails.chatId !== 0
        ) {
          handleSeenMessage(messageDetails.receiverId, messageDetails.chatId)();
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(unreadMessageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [unreadMessageRef, firstUnreadIndex, messageDetails, handleSeenMessage]);

  useEffect(() => {
    const handleInfiniteScroll = () => {
      if (chatContentRef.current) {
        const { scrollTop } = chatContentRef.current;

        setBackToBottom(scrollTop < -200);
      }

      if (recentChatRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = recentChatRef.current;
        if (
          scrollHeight - scrollTop <= clientHeight &&
          !loadingOnTakeRef.current &&
          totalConvos < totalConvosData
        ) {
          setAddTake((prev: any) => prev + 2);
        }
      }
    };

    recentChatRef?.current?.addEventListener("scroll", handleInfiniteScroll);
    chatContentRef?.current?.addEventListener("scroll", handleInfiniteScroll);
    return () => {
      recentChatRef?.current?.removeEventListener(
        "scroll",
        handleInfiniteScroll
      );
      chatContentRef?.current?.removeEventListener(
        "scroll",
        handleInfiniteScroll
      );
    };
  }, [totalMessages, totalData, totalConvosData, totalConvos, chatContentRef]);

  const handleBackToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (data.statusCode === 404) {
      navigate.back();
    }
    if (id) {
      setHasParams(true);
    }
  }, [data, id]);

  useEffect(() => {
    if (privateMessages) {
      setIsSending(false);
    }
  }, [privateMessages]);

  const handleInputChange = (title: any) => (e: any) => {
    setFormInput((formInput) => ({
      ...formInput,
      [title]: e.target.value,
    }));
  };

  const handleKeyDown = (e: any) => {
    if (window.innerWidth > 640) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (formInput.content) {
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

  const handleSendMessage = async () => {
    if (messageDetails.receiverId && messageDetails.chatId !== 0) {
      handleSeenMessage(messageDetails.receiverId, messageDetails.chatId)();
    }
    setFormInput({
      content: "",
      attachment: "",
    });
    messageRef.current = formInput?.content;
    sendMessage({
      toRefresh: true,
      receiverId: id,
      isSeenForSentMessage: true,
    });
    setIsSending(true);
    setIsRefresh(true);
    textareaRef.current.focus();
    textareaRef.current.style.height = "18px";
    if (isEmojiPickerOpen) {
      handleEmojiPickerOpen();
    }
    try {
      const response = await api.post(`chats/sendMessage/${id}`, {
        ...formInput,
      });
      if (response.status === 201) {
        setError("");
        setTimeout(() => {
          chatContentRef.current.scrollTop =
            chatContentRef.current.scrollHeight;
        }, 500);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
      if (error.response.status === 413) {
        showError("Payload too large. Please try again", "Error");
      }
    } finally {
      sendMessage({
        toRefresh: false,
        receiverId: "",
        isSeenForSentMessage: true,
      });
      setIsRefresh(false);
      messageRef.current = null;
    }
  };

  const handleSendLike = async () => {
    sendMessage({
      toRefresh: true,
      receiverId: id,
      isSeenForSentMessage: true,
    });
    setIsSending(true);
    setIsRefresh(true);
    try {
      const response = await api.post(`chats/sendMessage/${id}`, {
        content: "(y)",
      });

      if (response.status === 201) {
        setTimeout(() => {
          chatContentRef.current.scrollTop =
            chatContentRef.current.scrollHeight;
        }, 500);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      sendMessage({
        toRefresh: false,
        receiverId: "",
        isSeenForSentMessage: true,
      });
      setIsRefresh(false);
    }
  };

  const messages = convos?.conversations?.filter(
    (chat: any) =>
      (chat.senderId === user?.id && chat.receiverId === data?.user?.id) ||
      (chat.senderId === data?.user?.id && chat.receiverId === user?.id)
  );

  const handleEmojiSelect = (emoji: any) => {
    const currentValue = textareaRef.current.value;
    const newValue = currentValue + emoji;

    setFormInput((formInput: any) => ({
      ...formInput,
      content: newValue,
    }));
  };

  const handleEmojiPickerOpen = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleSearchTerm = (e: any) => {
    if (searchRef.current) clearTimeout(searchRef.current);

    searchRef.current = setTimeout(() => {
      setSearchTerm(e.target.value);
      setAddTake(totalUsersData);
    }, 500);
  };

  const allMessages = messages
    ? messages.flatMap((content: any) => content.messages)
    : [];
  firstUnreadIndex = allMessages.findLastIndex(
    (msg: any) => msg.userId !== user.id && !msg.isSeen
  );

  useEffect(() => {
    if (firstUnreadIndex !== -1) {
      const unreadMessage = allMessages[firstUnreadIndex];
      setMessageDetails({
        chatId: unreadMessage.chatId,
        receiverId: unreadMessage.userId,
      });
    }
  }, [firstUnreadIndex]);

  const handleOpenRecentChat = () => {
    setIsOpenRecentChat(!isOpenRecentChat);
  };

  const isPrivateChatting =
    privateChatIds?.receiverId === user?.id && privateChatIds?.senderId === id;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-gray-700 border border-r border-gray-200 dark:border-gray-600 flex flex-col md:w-80 ${
          isOpenRecentChat ? "" : "w-0"
        }`}
      >
        {/* Profile Header */}
        <div className="border p-4 border-b border-gray-200 dark:border-gray-600">
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
        {/* Recent Chats */}
        {!searchTerm ? (
          <div className="overflow-y-auto" ref={recentChatRef}>
            {loadingConvos || loadingOnSearch ? (
              <RecentChat />
            ) : convos?.conversations && convos?.conversations.length > 0 ? (
              convos?.conversations.map((convo: any, index: number) => (
                <RecentChatContent
                  key={index}
                  user={
                    convo.senderId === user?.id ? convo.receiver : convo.sender
                  }
                  lastMessage={convo?.messages[0]?.content}
                  unreadMessages={convo?.messages[0]?.chat?._count?.messages}
                  timeSent={convo?.messages[0]?.createdAt}
                  isActive={
                    (convo.senderId === user?.id &&
                      convo.receiverId === data?.user?.id) ||
                    (convo.senderId === data?.user?.id &&
                      convo.receiverId === user?.id)
                  }
                  isDeleted={convo?.messages[0]?.isDeleted}
                  lastMessageOwnerId={convo?.messages[0]?.userId}
                />
              ))
            ) : (
              <p className="text-center font-bold text-lg mt-5 break-words px-10 w-20 md:w-full">
                {searchTerm
                  ? `No "${searchTerm}" found`
                  : "No conversations yet"}
              </p>
            )}

            {loadingOnTake && <DoubleRecentChat />}
          </div>
        ) : (
          <div className="overflow-y-auto" ref={recentChatRef}>
            {loadingConvos || loadingOnSearch ? (
              <RecentChat />
            ) : convos?.searchedData?.length > 0 ? (
              convos?.searchedData?.map((user: any, index: number) => (
                <>
                  <RecentChatContent
                    key={index}
                    user={user}
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                  />
                </>
              ))
            ) : (
              <p className="text-center font-bold text-lg mt-5 break-words px-10 w-20 md:w-full">
                {searchTerm
                  ? `No "${searchTerm}" found`
                  : "No conversations yet"}
              </p>
            )}

            {loadingOnTake && <DoubleRecentChat />}
          </div>
        )}
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center">
            {loading ? (
              <ChatHeader />
            ) : (
              <>
                <button
                  type="button"
                  className="mr-3 block md:hidden"
                  onClick={handleOpenRecentChat}
                >
                  <i
                    className={`far ${
                      isOpenRecentChat ? "fa-arrow-left" : "fa-arrow-right"
                    }`}
                  ></i>
                </button>
                <Image
                  avatar={data?.user?.profile_pictures[0]?.avatar}
                  width={10}
                  height={10}
                  alt={data?.user?.name}
                />
                <div className="ml-3">
                  <p className="text-lg font-semibold">
                    {data?.user?.name || "Anonymous"}
                  </p>

                  <p className="text-sm text-gray-200">Online</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <i className="fas fa-phone-alt" />
            </button>
            <button className="text-white">
              <i className="fas fa-video" />
            </button>
            <button className="text-white">
              <i className="fas fa-cog" />
            </button>
          </div>
        </div>
        {/* Message Container */}
        <div
          ref={chatContentRef}
          className="flex-1 flex flex-col-reverse gap-1 p-4 overflow-y-auto bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
        >
          {isSending && messageRef?.current && (
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
                    messageRef.current === "(y)"
                      ? ""
                      : "dark:bg-blue-400/50 bg-blue-400/80"
                  } xl:max-w-4xl 2xl:max-w-7xl sm:max-w-lg md:mx-w-xl lg:max-w-2xl max-w-[230px] text-white p-3 rounded-2xl shadow-md`}
                >
                  <p className="text-sm whitespace-break-spaces break-words">
                    {formatMessages(messageRef?.current.trim(), 16, 16)}
                  </p>
                </div>
              </div>
            </div>
          )}
          {isPrivateChatting && (
            <div className="relative pt-4">
              <div className="text-start absolute left-0 -bottom-2 flex gap-1">
                <div
                  key={userTypingInfoPrivate?.id}
                  className="flex items-center gap-1"
                >
                  <div className="flex items-center -ml-2">
                    <Image
                      avatar={
                        userTypingInfoPrivate?.profile_pictures?.filter(
                          (item: any) => item?.isSet
                        )[0]?.avatar
                      }
                      alt={userTypingInfoPrivate?.name}
                      width={5}
                      height={5}
                      title={userTypingInfoPrivate?.name}
                    />
                  </div>{" "}
                  <div className="flex gap-1 items-center py-3 px-2 rounded-xl bg-gray-600 dark:bg-gray-300 w-fit">
                    {Array.from(Array(3)).map((_, index) => (
                      <span
                        className="rounded-full p-1 dark:bg-gray-800 bg-gray-200 animate-bounce"
                        key={index}
                        style={{ animationDelay: 0.3 * index + "s" }}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading || privateMessagesLoading ? (
            <Content />
          ) : privateMessages.messages[0]?.messages?.length > 0 ? (
            privateMessages?.messages[0]?.messages?.map(
              (message: any, index: number) => {
                const currentTime = new Date(message.createdAt);

                const prevMessage =
                  index > 0
                    ? privateMessages.messages[0]?.messages[index - 1]
                    : null;

                const nextMessage =
                  index < privateMessages.messages[0]?.messages.length - 1
                    ? privateMessages.messages[0]?.messages[index + 1]
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

                const sameMinuteUserMessages =
                  privateMessages.messages[0]?.messages.filter(
                    (m: any) => getUserMinuteKey(m) === currentKey
                  );

                const isOnlyInMinuteUser = sameMinuteUserMessages.length === 1;

                const bubbleClass = isOnlyInMinuteUser && "rounded-3xl";

                return (
                  <div key={index}>
                    {index === firstUnreadIndex &&
                      message.userId !== user.id && (
                        <div
                          className="flex justify-center mb-2"
                          ref={unreadMessageRef}
                        >
                          <div className="w-full flex justify-center items-center gap-2">
                            <div className="border-b w-2/6 border-gray-400"></div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs">
                              Unread messages
                            </div>
                            <div className="border-b w-2/6 border-gray-400"></div>
                          </div>
                        </div>
                      )}
                    {isFirstInGroup && (
                      <div className="flex justify-center text-gray-500 dark:text-gray-300 text-xs my-2">
                        {formatChatTimestamp(currentTime)}
                      </div>
                    )}
                    <ChatContent
                      messageId={message?.id}
                      content={message?.content}
                      avatar={data?.user?.profile_pictures[0]?.avatar}
                      sender={message?.userId === user?.id}
                      name={data?.user?.name}
                      timeSent={message?.createdAt}
                      isNotSeen={message?.isSeen === false}
                      link={message?.link}
                      isLast={isLastInGroup}
                      isFirst={isFirstInGroup}
                      bubbleClass={bubbleClass}
                      sendMessageRealtime={sendMessage}
                      isDeleted={message?.isDeleted}
                    />
                  </div>
                );
              }
            )
          ) : (
            <p className="text-center mb-20 items-center">
              Start an conversation with <strong>{data?.user?.name}</strong>.{" "}
              Say <strong>HI</strong>{" "}
              <i className="fas fa-hand-wave text-xl"></i>{" "}
            </p>
          )}

          {loadingOnTakePrivateMessages && (
            <div className="relative flex justify-center items-center">
              <i className="fa-duotone fa-solid fa-spinner-third text-center animate-spin"></i>
            </div>
          )}
          <span ref={sentinelRef}></span>
        </div>
        {/* Message Input Area */}
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
          <div className="bottom-3 absolute">
            <button type="button">
              <i className="far fa-image text-2xl"></i>
            </button>
          </div>
          <div className="relative w-full py-2 bg-gray-100 dark:bg-gray-500 pr-10 rounded-3xl mx-9">
            <div className="relative">
              <TextArea
                textareaRef={textareaRef}
                value={formInput.content}
                onChange={handleInputChange("content")}
                error={error?.content?.message}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                disabled={loading}
                maxLength={85000}
              />

              {loading && (
                <p className="rounded-3xl -top-0.5 left-1 absolute h-6 w-full bg-slate-300 dark:bg-slate-400 animate-pulse"></p>
              )}
            </div>
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
            {formInput.content ? (
              <Button
                type="button"
                onClick={handleSendMessage}
                icon="paper-plane-top"
                color="blue-500"
                hoverColor="blue-600"
              />
            ) : (
              <Button
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
    </div>
  );
};

export default withAuth(Chats);
