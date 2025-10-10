import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { useUser } from "@/context/userContext";
import { useNavbar } from "@/context/NavbarContext";
import { getUserByUserId } from "@/services/userService";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export function NewConversationScreen() {
  const router = useRouter();
  const { rec_id } = router.query;
  const { user } = useUser(); // current logged-in user context
  const { updateNavbar, resetNavbar } = useNavbar();

  const [loading, setLoading] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch receiver profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!rec_id) return;
      setLoading(true);
      setError(null);

      const res = await getUserByUserId(rec_id, false);
      if (!res) return setError("No response from server"), setLoading(false);
      if (!res.ok) return setError("Failed to fetch user"), setLoading(false);

      const res_json = await res.json();
      if (res_json?.success) setReceiver(res_json.data);
      else setError(res_json?.error || "Something went wrong");

      setLoading(false);
    };

    fetchUser();
  }, [rec_id]);

  // Join chat room on load (for typing indicators / readiness)
  useEffect(() => {
    if (!user || !rec_id) return;

    const data = {
      user_id: user.user_id,
      participants: [user.user_id, rec_id],
    };
    socket.emit("join_chat", data);

    socket.on("joined_room", (payload) => {
      console.log("✅ Joined room:", payload.room_id);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    // clean up when component unmounts
    return () => {
      socket.emit("leave_chat", {
        conversation_id: null,
        user_id: user.user_id,
      });
      socket.off("joined_room");
      socket.off("error");
    };
  }, [user, rec_id]);

  // Send message
  const handleSend = () => {
    if (!message.trim()) return;

    const payload = {
      conversation_id: null,
      participants: [user.user_id, rec_id],
      sender: user.user_id,
      content: message.trim(),
    };

    socket.emit("send_user_message", payload);
    setMessage("");
  };

  // Listen for the first new_message → redirect to conversation
  useEffect(() => {
    socket.on("new_message", (data) => {
      console.log("📩 new_message:", data);
      if (data?.conversation_id) {
        router.push(`/conversation/${data.conversation_id}`);
      }
    });

    return () => socket.off("new_message");
  }, []);

  if (loading) return <p>Loading user...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!receiver) return null;

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-xl font-semibold mb-4">
        Start chatting with {receiver.user_data?.name || "user"}
      </h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your first message..."
        className="w-full border rounded-lg p-3 resize-none mb-3"
      />

      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="bg-blue-600 text-white rounded-lg py-2"
      >
        Send
      </button>
    </div>
  );
}
