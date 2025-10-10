import styles from "./profilecard.module.css";
import { Star, X, MessageCircleHeart } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

import { useUser } from "@/context/userContext";
import { createConversation } from "@/services/conversationService";

export default function ProfileCard({
  name,
  age,
  location,
  matchPercent,
  description,
  id,
}) {
  const { userId } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChatClick() {
    setLoading(true);
    setError(null);

    try {
      console.log("USER ID : ", userId, id);
      const response = await createConversation(userId, id);
      if (!response.ok) {
        console.log(response.status);
        return;
      }
      const conversation = await response.json();
      console.log("conversation", conversation);
      if (conversation.data) {
        const conversationId = conversation.data._id?.$oid;
        router.push(`/conversation/${conversationId}`);
      } else {
        setError(conversation.error || "Failed to start conversation");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.heading}>
          <div className={`${styles.badge} ${styles.ai}`}>AI Match</div>
          <div className={`${styles.badge}`}>
            <Star strokeWidth={1.25} size={"15px"} color="#09c092" />
            {matchPercent}%
          </div>
        </div>
        <div className={styles.userDetails}>
          <h1>{name}</h1>
          <p>{location ? location : "Location not available"}</p>
          <p>{matchPercent}% match</p>
        </div>
      </div>

      <div className={styles.actionPanel}>
        <div className={styles.row}>
          <p>{description}</p>
        </div>
        <div className={styles.row}>
          <button className={styles.ghost}>
            <X strokeWidth={1.25} size={15} />
            <p>Reject</p>
          </button>

          <button
            className={styles.primary}
            onClick={handleChatClick}
            disabled={loading}
          >
            <MessageCircleHeart strokeWidth={1.25} size={15} />
            <p>{loading ? "Starting..." : "Chat"}</p>
          </button>
        </div>

        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
