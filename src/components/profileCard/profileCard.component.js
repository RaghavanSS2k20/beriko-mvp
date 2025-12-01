import { useState } from "react";
import styles from "./profilecard.module.css";
import { Star, X, Flower, MessageCircle } from "lucide-react";
export default function ProfileCard({
  name,
  age,
  location,
  matchPercent,
  description,
  id,
  handleSendFlowersClick,
  handleDeleteClick,
  mutual,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Corrected click handler
  function handleActionClick() {
    const profileData = {
      id,
      name,
      age,
      location,
      matchPercent,
      description,
      mutual,
    };
    handleSendFlowersClick(profileData);
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.heading}>
          <div className={`${styles.badge} ${styles.ai}`}>AI Match</div>
          <div className={`${styles.badge}`}>
            <Star size={"15px"} color="#09c092" />
            {Math.round(matchPercent)}%
          </div>
        </div>
        <div className={styles.userDetails}>
          <h1>{name}</h1>
          <p>{location ? location : "Location not available"}</p>
          <p>{Math.round(matchPercent)}% match</p>
        </div>
      </div>

      <div className={styles.actionPanel}>
        <div className={styles.row}>
          <p>{description}</p>
        </div>
        <div className={styles.row}>
          <button
            className={styles.ghost}
            onClick={() => handleDeleteClick && handleDeleteClick(id)}
          >
            <X strokeWidth={1.25} size={15} />
            <p>Reject</p>
          </button>
          <button
            className={styles.primary}
            onClick={handleActionClick}
            disabled={loading}
          >
            {mutual ? (
              <MessageCircle strokeWidth={2.25} size={15} />
            ) : (
              <Flower strokeWidth={2.25} size={15} />
            )}
            <p>
              {loading
                ? mutual
                  ? "Opening..."
                  : "Starting..."
                : mutual
                ? "Chat"
                : "Send Flowers"}
            </p>
          </button>
        </div>

        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
