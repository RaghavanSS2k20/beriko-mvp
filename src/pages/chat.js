"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/chat.module.css";
import ChatInput from "@/components/chatInput/chatInputComponent";
import { useUser } from "@/context/userContext";

import { environment } from "@/environment";
const socket = io(environment.apiUrl); // change to your backend URL

export default function ChatPage() {
  const { userId } = useUser(); // ✅ get from context
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    console.log(userId);
    if (!userId) return; // wait until userId is available

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${environment.apiUrl}/user/${userId}/chats`);
        const data = await res.json();
        if (data?.data.length > 0) {
          setMessages(data?.data?.map((m) => ({ ...m, status: "sent" })));
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();

    socket.emit("join", { user_id: userId });

    socket.on("new_message", (msg) => {
      if (msg.type === "agent") {
        console.log(msg);
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "agent",
            content: msg.content,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "sent",
          },
        ]);
      }

      if (msg.type === "user") {
        setMessages((prev) =>
          prev.map((m, idx) =>
            idx === prev.length - 1 && m.status === "pending"
              ? { ...m, status: "sent" }
              : m
          )
        );
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [userId]);

  const sendMessage = (content) => {
    if (!content.trim() || !userId) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      content: content,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    setMessages((prev) => [...prev, newMsg]);

    socket.emit("send_message", { user_id: userId, content });

    setTyping(true);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "agent" ? styles.ai : styles.user
            } ${msg.status === "pending" ? styles.pending : ""}`}
          >
            <div className={styles.bubble}>{msg.content}</div>
            <div className={styles.time}>
              {" "}
              {new Date(msg.timestamp).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short", // short month name like "Oct"
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
      </div>

      <div className={styles.inputWrapper}>
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
