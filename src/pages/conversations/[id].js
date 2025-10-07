import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/userContext";
import { useNavbar } from "@/context/NavbarContext";

import io from "socket.io-client";

import { environment } from "@/environment";
import { getConversationById } from "@/services/conversationService";
// import { useUser } from "@/context/u serContext";
import ChatInput from "@/components/chatInput/chatInputComponent";

import styles from "../../styles/chat.module.css";

const socket = io(environment.apiUrl); // replace with your backend socket URL

export default function ConversationScreen() {
  const router = useRouter();
  const { updateNavbar, resetNavbar } = useNavbar();
  const { id } = router.query; // conversationId
  const conversationId = id;

  const { userId } = useUser();
  //   console.log(user);
  //   const userId = user?.id;

  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [typing, setTyping] = useState(false);
  const [conversation, setConversation] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial conversation messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchConversation = async () => {
      try {
        const res = await getConversationById(conversationId);
        if (!res.ok) return;

        const json = await res.json();
        const messages = json.data?.messages || [];
        const participants = json.data?.participants || [];

        console.log(messages);
        setMessages(messages);
        setParticipants(participants);

        // find the other user (excluding current user)
        const otherUser = participants.find((p) => p.user_id !== userId);

        if (otherUser) {
          updateNavbar({
            title: otherUser.name,
            subtitle: "Online",
            avatar: true,
            backRoute: "/conversations",
            showFilter: false,
          });
        }
      } catch (err) {
        console.error("Failed to fetch conversation:", err);
      }
    };

    fetchConversation();

    // cleanup on unmount
    return () => resetNavbar();
  }, [conversationId, userId]);
  // Socket.IO setup
  useEffect(() => {
    if (!conversationId || !userId || participants.length === 0) return;

    socket.emit("join_chat", {
      user_id: userId,
      participants,
      conversation_id: conversationId,
    });

    socket.on("joined_room", (data) => {
      console.log("Joined room:", data.room_id);
    });

    socket.on("chat_history", (data) => {
      console.log(data);
      //   setMessages(data);
    });

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stop_typing", () => setTyping(false));

    socket.on("error", (err) => console.error("Socket error:", err.message));

    return () => {
      socket.emit("leave_chat", {
        user_id: userId,
        conversation_id: conversationId,
      });
      socket.off("joined_room");
      socket.off("chat_history");
      socket.off("new_message");
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("error");
    };
  }, [conversationId, participants, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const sendMessage = (text) => {
    console.log("SEND MESSAGE CALLED : ", text);
    if (!text.trim()) return;

    socket.emit("send_user_message", {
      sender: userId,
      participants: participants.map((p) => p.user_id),
      conversation_id: conversationId,
      content: text,
    });
  };

  if (!userId) return <div>Loading user...</div>;

  return (
    <div className={styles.chatContainer} style={{ width: "100%" }}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === userId ? styles.user : styles.ai
            } ${msg.status === "pending" ? styles.pending : ""}`}
          >
            <div className={styles.bubble}>{msg.content}</div>
            <div className={styles.time}>
              {new Date(msg.timestamp).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
          </div>
        ))}

        {typing && (
          <div className={`${styles.message} ${styles.ai}`}>
            <div className={styles.bubble}>Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputWrapper}>
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
