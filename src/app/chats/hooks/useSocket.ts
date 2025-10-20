import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { PayloadInterface } from "../types/PayloadInterface";
import { PrivateChatIds } from "../utils/chatConstants";
import { useAuth } from "@/app/context/AuthContext";
import PlayMessageTone from "../utils/playMessageTone";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sentMessage, setSentMessage] = useState<boolean>(false);
  const [sentPublicMessage, setSentPublicMessage] = useState<boolean>(false);
  const [receiverId, setReceiverId] = useState<any>("");
  const [isSeenSentMessage, setIsSeenSentMessage] = useState(false);
  const [userTypingInfo, setUserTypingInfo] = useState<any>(null);
  const [userTypingInfoPrivate, setUserTypingInfoPrivate] = useState<any>(null);
  const [privateChatIds, setPrivateChatIds] = useState(PrivateChatIds);
  const [senderId, setSenderId] = useState<any>(null);
  const { user: currentUser }: any = useAuth();
  const typingTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const typingTimeoutsPrivate = useRef<any>(null);

  useEffect(() => {
    if (
      (sentPublicMessage && senderId !== currentUser?.id) ||
      (sentMessage && receiverId === currentUser?.id)
    ) {
      PlayMessageTone();
    }
  }, [sentMessage, sentPublicMessage, receiverId, senderId]);

  useEffect(() => {
    const token = Cookies.get("APP-TOKEN");
    const rememberToken = Cookies.get("APP-REMEMBER-TOKEN");
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: {
        token: `${token}:${rememberToken}`,
      },
    });
    socketInstance.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });

    socketInstance.on("connect", () => {
      setSocket(socketInstance);
    });

    socketInstance.on("sentMessage", (toRefresh: boolean) => {
      setSentMessage(toRefresh);
    });

    socketInstance.on("receiverId", (receiverId: string) => {
      setReceiverId(receiverId);
    });

    socketInstance.on(
      "isSeenForSentMessage",
      (isSeenForSentMessage: boolean) => {
        setIsSeenSentMessage(isSeenForSentMessage);
      }
    );

    socketInstance.on("sentPublicMessage", (toRefresh: boolean) => {
      setSentPublicMessage(toRefresh);
    });

    socketInstance.on("publicSenderId", (publicSenderId: string) => {
      setSenderId(publicSenderId);
    });

    socketInstance.on("userTypeToChat", ({ chatReference, user }: any) => {
      if (chatReference || !user?.id) return;

      if (typingTimeouts.current[user.id]) {
        clearTimeout(typingTimeouts.current[user.id]);
      }

      setUserTypingInfo((prev: any) => ({
        ...prev,
        [user.id]: user,
      }));

      typingTimeouts.current[user.id] = setTimeout(() => {
        setUserTypingInfo((prev: any) => {
          const updated = { ...prev };
          delete updated[user.id];
          return updated;
        });
      }, 500);
    });

    socketInstance.on(
      "userTypeToChatPrivate",
      ({ receiverId, senderId, user }: any) => {
        const isOwnMessage = receiverId === user?.id && senderId === user?.id;
        if (
          !receiverId ||
          !senderId ||
          !user?.id ||
          !currentUser ||
          isOwnMessage
        ) {
          return;
        }

        const isChattingWith =
          receiverId === currentUser?.id && senderId === user?.id;

        if (!isChattingWith) return;

        if (typingTimeoutsPrivate.current) {
          clearTimeout(typingTimeoutsPrivate.current);
        }
        setUserTypingInfoPrivate(user);
        setPrivateChatIds({
          receiverId,
          senderId,
        });

        typingTimeoutsPrivate.current = setTimeout(() => {
          setUserTypingInfoPrivate("");
          setPrivateChatIds(PrivateChatIds);
        }, 500);
      }
    );

    return () => {
      socketInstance.disconnect();
    };
  }, [typingTimeoutsPrivate, currentUser, typingTimeouts]);

  const sendMessage = ({
    toRefresh,
    receiverId,
    isSeenForSentMessage,
  }: PayloadInterface) => {
    socket?.emit("sendMessage", {
      toRefresh,
      receiverId,
      isSeenForSentMessage,
    });
  };

  const sendPublicMessage = (toRefresh: boolean, publicSenderId: string) => {
    socket?.emit("sendPublicMessage", { toRefresh, publicSenderId });
  };

  const userTyping = ({ chatReference, user }: any) => {
    socket?.emit("userTyping", { chatReference, user });
  };

  const userTypingPrivate = ({ receiverId, senderId, user }: any) => {
    socket?.emit("userTypingPrivate", { receiverId, senderId, user });
  };

  return {
    sentMessage,
    sendMessage,
    sentPublicMessage,
    sendPublicMessage,
    receiverId,
    isSeenSentMessage,
    userTyping,
    userTypingInfo,
    userTypingInfoPrivate,
    userTypingPrivate,
    privateChatIds,
  };
};

export default useSocket;
