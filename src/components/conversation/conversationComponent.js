import styles from "./conversation.module.css";
import { User } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useNavbar } from "@/context/NavbarContext";

export default function Conversation({ conversation, user }) {
  console.log("Convo  : ", conversation);
  const router = useRouter();
  const { updateNavbar, resetNavbar } = useNavbar();
  const otherParticipant = conversation?.participants.find(
    (p) => p.user_id !== user
  );

  useEffect(() => {
    updateNavbar({
      title: "conversations",
      subtitle: "Online",
      avatar: false,
      // showFilter: false,
    });
    return () => resetNavbar();
  }, []);

  // Format updated_at nicely (optional)
  const localTime = new Date(conversation.updated_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", // force IST
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formatMessageTime = () => {
    const timestamp = conversation.updated_at;
    const date = new Date(timestamp);
    const now = new Date();

    // Convert both to IST
    const istDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const istNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const isToday =
      istDate.getDate() === istNow.getDate() &&
      istDate.getMonth() === istNow.getMonth() &&
      istDate.getFullYear() === istNow.getFullYear();

    const yesterday = new Date(istNow);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      istDate.getDate() === yesterday.getDate() &&
      istDate.getMonth() === yesterday.getMonth() &&
      istDate.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return istDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return istDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
      });
    }
  };

  const handleClick = () => {
    router.push(`/conversation/${conversation.conversation_id}`);
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.profileDetails}>
        <div className={styles.profilePhoto}>
          <User size={25} />
        </div>
        <div className={styles.profileContent}>
          <p className={styles.profileName}>{otherParticipant.name}</p>
          <p className={styles.profileContext}>{conversation.last_message}</p>
        </div>
      </div>
      <div className={styles.time}>{formatMessageTime()}</div>
    </div>
  );
}
