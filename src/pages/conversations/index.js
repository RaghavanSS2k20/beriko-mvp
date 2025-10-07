import { useState, useEffect } from "react";
import Conversation from "@/components/conversation/conversationComponent";
import styles from "../../styles/conversation.module.css";
import { getConversationForUserId } from "@/services/conversationService";
import { useUser } from "@/context/userContext";

export default function ChatPage() {
  const { userId } = useUser();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        const response = await getConversationForUserId(userId);

        if (!response.ok) {
          setError(`Error fetching conversations: ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Data : ", data);

        if (!data || data.data?.length === 0) {
          setError("No conversations found");
          setConversations([]);
        } else {
          console.log("Conversations : ", data.data);
          setConversations(data.data);
          setError("");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId]);

  if (loading) {
    return <div className={styles.loading}>Loading conversations...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      {conversations.length > 0 ? (
        conversations.map((conv, index) => (
          <Conversation
            key={conv.id || index}
            conversation={conv}
            user={userId}
          />
        ))
      ) : (
        <div className={styles.empty}>No conversations available</div>
      )}
    </div>
  );
}
